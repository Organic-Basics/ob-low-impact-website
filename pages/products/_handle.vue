<template>
  <div>
    <div class="product__slideshow">
      <div v-for="(image, index) in mainProduct.images.edges">
        <img :src="image.node.transformedSrc">
      </div>
    </div>
    <!-- Sticky bar -->
    <div class="product__sticky">
      <div class="product__sticky-top">
        <div class="product__sticky-top-left">
          <h6 class="product__sticky-title">{{mainProduct.title}}</h6>
          <p class="product__sticky-price">{{parseInt(mainProduct.priceRange.minVariantPrice.amount)}} {{mainProduct.priceRange.minVariantPrice.currencyCode}}</p>
        </div>
        <div class="product__sticky-top-right" v-if="isSingleProduct">
          <div class="product__sticky-size">{{products[0].chosenSize}}</div>
          <div class="product__sticky-color">{{products[0].chosenColor}}
            <span></span>
          </div>
        </div>
      </div>
      <div class="product__sticky-bottom">
        <div class="product__sticky--buttons">
          <div class="product__main--quantity">
            <a class="product__main--decrement" href="">-</a>
            <input class="product__main--quant-picker" type="number" name="quantity" v-model="quantity">
            <a class="product__main--increment" href="">+</a>
          </div>
          <button class="product__main--add-to-cart" type="button" name="add-to-cart" v-model="addMessage"
          @click="addToCart()">Add to cart</button>
        </div>
      </div>
    </div>
    <productSelect v-for="(prod, index) in products" v-if="prod.switchId == 0 || prod.switchId == switchId || prod.switchId === undefined"
    :key="index" :product="prod"
    @optClicked="onIdChosen" @switched="switchId = switchId == 1 ? 2 : 1" @addFromChild="addToCart()"/>
  </div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
import ProductSelect from '~/components/ProductSelect.vue'

export default Vue.extend({

  data() {
    return {
      quantity: 1,
      isAdding: false,
      switchId: 1
    }
  },
  components: {
    ProductSelect
  },
  async asyncData({app, params}) {
    try {
      if(app && app.apolloProvider && app.apolloProvider.defaultClient) {
        let client = app.apolloProvider.defaultClient
        let result = await client.query({
          query: gql`
            query {
              productByHandle(handle: "${params.handle}") {
                title,
                id,
                description,
                priceRange {
                  minVariantPrice {
                    amount,
                    currencyCode
                  }
                },
                tags,
                options {
                  name,
                  values
                }
                images(first: 10) {
                  edges {
                    node {
                      transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER)
                    }
                  }
                },
                variants(first: 50) {
                  edges {
                    node {
                      selectedOptions {
                        name,
                        value
                      },
                      id
                    }
                  }
                }
              }
            }
          `
        })
        let product = result.data.productByHandle
        let bundleTag = ''
        let isSingleProduct = result.data.productByHandle.tags.some((tag) => {
          let isBundleTag = tag.includes('combo') || tag.includes('quant')
          if(isBundleTag) {
            if(tag.split('-').length > 2) {
              return true
            }
            else {
              bundleTag = tag
            }
          }
          return false
        })

        let newData = {
          mainProduct : product,
          products: [],
          isSingleProduct : isSingleProduct
        }

        if(isSingleProduct) {
          newData.products = prepProducts([product])
        }
        else {
          let result = await client.query({
            query: gql`
              query {
                products(query: "tag:${bundleTag} AND (tag:'combo' OR tag:'quant)", first: 5) {
                  edges {
                    node {
                      title,
                      id,
                      description,
                      priceRange {
                        minVariantPrice {
                          amount,
                          currencyCode
                        }
                      },
                      tags,
                      options {
                        name,
                        values
                      }
                      variants(first: 50) {
                        edges {
                          node {
                            selectedOptions {
                              name,
                              value
                            },
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          })
          let bundleProducts = result.data.products.edges

          // Remove Gift boxes
          let giftboxIndex = bundleProducts.findIndex((a) => {
            if(a.node.title === 'Gift Box') return true
          })
          if(giftboxIndex > -1) bundleProducts.splice(giftboxIndex, 1)

          newData.bundleData = {
            tag : bundleTag,
            name : product.title
          }

          newData.products = prepProducts(bundleProducts, newData.bundleData)
        }
        return newData
      }
      else {
        return {
          mainProduct : {},
          products: [],
          isSingleProduct : true,
          bundleData : {
            tag : '',
            name : ''
          }
        }
      }
    } catch(err) {
      console.error(err)
      return {
        mainProduct : {},
        products: [],
        isSingleProduct : true,
        bundleData : {
          tag : '',
          name : ''
        }
      }
    }
  },
  computed: {
    addMessage () {
      if(this.isAdding) return 'Adding...'
      else if(this.incomplete) return 'Select color and size'
      else return 'Add to cart'
    }
  },
  methods: {
    async addToCart () {
      this.isAdding = true
      let cartIds = this.$store.getters.cartIds
      for(let prod of this.products) {
      	// If the product has a switchId, and it's not the active one, skip loop
        if(prod.switchId != 0 && prod.switchId != this.switchId && prod.switchId !== undefined) continue

        // If this id is already in the cart, increase the quantity of it before sending to Shopify
        cartIds = cartIds.map((a) => {
          if(a.variantId === prod.chosenId) {
            a.quantity += parseInt(this.quantity)
            return a
          }
          else {
            return a
          }
        })

        // If this id is not in the cart, add it to the cartIds that are sent to Shopify
        if(!cartIds.some((a) => {
          return a.variantId === prod.chosenId
        })) {
          let newCartId = {
            variantId: prod.chosenId,
            quantity: parseInt(this.quantity)
          }
          if(this.bundleData && this.bundleData.tag && this.bundleData.name) {
            newCartId.customAttributes = [
              {
                key: '_bundle_id',
                value: this.bundleData.tag
              },
              {
                key: 'Bundle',
                value: this.bundleData.name
              }
            ]
          }
          cartIds = [...cartIds, ...[newCartId]]

        }
      }

      let result = await this.$apollo.mutate({
        mutation: gql`
          mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!, $checkoutAttributes: CheckoutAttributesUpdateV2Input!) {

            checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
              userErrors {
                message
                field
              }
              checkout {
                id
              }
            },

            checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $checkoutAttributes) {
              checkoutUserErrors {
                message
                field
              }
              checkout {
                id
              }
            }

          }
        `,
        variables: {
          checkoutId: this.$store.state.checkoutId,
          lineItems: cartIds,
          checkoutAttributes: {
            customAttributes: [{
              key: 'isLowImpactWebsite',
              value: 'true'
            }]
          }
        }
      })
      this.isAdding = false
      this.$store.dispatch('fetchCart')
    },

    onIdChosen(data) {
      let parentProduct = this.products.find((a) => {
        return a.id === data.prodId
      })
      parentProduct.chosenId = data.id
      parentProduct.chosenColor = data.color
      parentProduct.chosenSize = data.size
    }
  }
})

function prepProducts (products, bundleData) {
  let productTemplate = {
    chosenColor : '...',
    chosenSize : '...',
    chosenId : '...',
    tabs : {
      desc : [],
      fitSize : [],
      materialCare : [],
      features : [],
    }
  }

  for(let i = 0; i < products.length; i++) {
    if(products[i].node) products[i] = {...productTemplate, ...products[i].node}
    else products[i] = {...productTemplate, ...products[i]}

    if(products[i].variants.edges.length > 1) {
      products[i].chosenColor = products[i].variants.edges[0].node.selectedOptions.find((a) => a.name === 'Color').value
      products[i].chosenSize = products[i].variants.edges[0].node.selectedOptions.find((a) => a.name === 'Size').value
      products[i].chosenId = products[i].variants.edges[0].node.id
    }
    if(products[i].description.split('|').length > 1) {
      let productText = products[i].description.split('|')
      products[i].tabs.desc = productText[0].split('///')
      products[i].tabs.fitSize = productText[1].split('///')
      products[i].tabs.materialCare = productText[2].split('///')
      products[i].tabs.features = productText[3].split(',')
    }

    if(bundleData) {
      let productBundleTag = products[i].tags.find((tag) => {
        return tag.includes(bundleData.tag)
      })
      products[i].switchId = productBundleTag.split('-')[3]
    }
  }

	products = products.map((a) => {
		if(a.switchId == 1) {
			a.switchProduct = products.find((a) => {
				return a.switchId == 2
			}).title
		}
		else if(a.switchId == 2) {
			a.switchProduct = products.find((a) => {
				return a.switchId == 1
			}).title
		}
		return a
	})

  return products
}
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

body {
  background: #fff;

  .container {
    margin-top: 0;
  }

  .header {
    position: absolute;
    top: 0;
  }

  .product__slideshow {
    display: flex;
    overflow-x: scroll;
    width: 100vw;

    img {
      min-width: 100vw;
      max-width: 100%;
    }
  }

  .product__sticky {
    color: map-get($colors, 'black');
    background: #fff;
    border-top: 1px solid #a1a4a9;
    bottom: 0;
    left: 0;
    position: fixed;
    transition: transform .3s ease-in-out;
    transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
    width: 100vw;

    .product__sticky-top {
      display: flex;
      height: 4rem;
      justify-content: space-between;
      padding: 1rem;
      align-items: center;

      .product__sticky-top-left {
        display: flex;

        .product__sticky-title {
          margin-right: 10px;
        }

        .product__sticky-price {
          color: map-get($colors, 'brand');
        }
      }

      .product__sticky-top-right {
        align-items: center;
        display: flex;

        .product__sticky-size {
          padding-right: .5rem;
        }

        .product__sticky-color {
          height: 30px;
          position: relative;
          width: 30px;

          span {
            border-radius: 30px;
            height: 30px;
            left: 0;
            position: absolute;
            top: 0;
            width: 30px;
          }
        }
      }
    }

    .product__sticky-bottom {
      .product__sticky--buttons {
        margin-bottom: 0;
        display: flex;
        justify-content: space-between;

        .product__main--quantity {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          flex-basis: 50%;
          border-top: 1px solid map-get($colors, 'brand');
          height: 3.6rem;

          .product__main--decrement, .product__main--increment {
            color: map-get($colors, 'black');
            width: 40px;
            position: absolute;
            top: 0;
            bottom: 0;
            width: 40px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            font-size: 19px;
          }

          .product__main--increment {
            right: 0;
            left: auto;
          }

          .product__main--decrement {
            left: 0;
          }

          .product__main--quant-picker {
            border: none;
            color: map-get($colors, 'black');
            height: 100%;
            text-align: center;
            font-size: 13px;
          }
        }

        .product__main--add-to-cart {
          flex-basis: 50%;
          border: 1px solid map-get($colors, 'black');
        }
      }
    }
  }

  .product__main {
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    .product__option {
      align-items: flex-start;
      display: flex;
      flex-direction: column;

      &.product__option--size {
        margin-bottom: 30px;
      }

      .chosen {
        text-decoration: underline;
      }
    }

    .product__text {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      margin-bottom: 5px;

      ul {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        text-align: left;
      }
    }
  }

  .product__main--add-to-cart {
    height: 3.6rem;
    text-align: center;
    background: map-get($colors, 'black');
    color: white;
    cursor: pointer;
    font-size: 13px;
  }
}

</style>
