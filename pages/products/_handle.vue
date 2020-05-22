<template>
  <div>
    <div class="product__slideshow">
      <div v-for="(image, index) in mainProduct.images.edges">
        <img :src="image.node.transformedSrc">
      </div>
    </div>
    <div class="product__sticky">
      <div class="product__sticky-top">
        <div class="product__sticky-top-left">
          <span class="product__sticky-title">{{mainProduct.title}}</span>
          <span class="product__sticky-price">{{parseInt(mainProduct.priceRange.minVariantPrice.amount)}} {{mainProduct.priceRange.minVariantPrice.currencyCode}}</span>
        </div>
        <div class="product__sticky-top-right" v-if="isSingleProduct">
          <span class="product__sticky-size">{{products[0].chosenSize}}</span>
          <span class="product__sticky-color">{{products[0].chosenColor}}</span>
        </div>
      </div>
      <div class="product__sticky-bottom">
        <input type="number" name="quantity" v-model="quantity">
        <input type="button" name="add-to-cart" v-model="addMessage" @click="addToCart()">
      </div>
    </div>
    <productSelect v-for="(prod, index) in products" :key="index" :product="prod" @optClicked="onIdChosen"/>
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
      isAdding: false
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
          console.log(app)
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
          newData.products = prepProducts(bundleProducts)
        }
        return newData
      }
      else {
        return {
          mainProduct : {},
          products: [
            {
              chosenColor : '...',
              chosenSize : '...',
              chosenId : '...',
              description : {
                desc : [],
                fitSize : [],
                materialCare : [],
                features : [],
              },
            }
          ],
          isSingleProduct : true
        }
      }
    } catch(err) {
      console.error(err)
      return {
        mainProduct : {},
        products: [
          {
            chosenColor : '...',
            chosenSize : '...',
            chosenId : '...',
            description : {
              desc : [],
              fitSize : [],
              materialCare : [],
              features : [],
            },
          }
        ],
        isSingleProduct : true
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
          cartIds = [...cartIds, ...[{variantId: prod.chosenId, quantity: parseInt(this.quantity)}]]
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

function prepProducts (products) {
  let productTemplate = {
    chosenColor : '...',
    chosenSize : '...',
    chosenId : '...',
    tabs : {
      desc : [],
      fitSize : [],
      materialCare : [],
      features : [],
    },
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
  }
  return products
}
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

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
  background: white;
  bottom: 0;
  color: map-get($colors, 'black');
  display: flex;
  flex-direction: column;
  max-height: 300px;
  position: fixed;
  left: 0;
  width: 100vw;

  .product__sticky-top {
    display: flex;

    .product__sticky-top-left {
      flex: 50%;
    }
  }
}

</style>
