<template>
  <div>
    <div class="product__slideshow">
      <div v-for="(image, index) in product.images.edges">
        <img :src="image.node.transformedSrc">
      </div>
    </div>
    <div class="product__sticky">
      <div class="product__sticky-top">
        <div class="product__sticky-top-left">
          <span class="product__sticky-title">{{product.title}}</span>
          <span class="product__sticky-price">{{parseInt(product.priceRange.minVariantPrice.amount)}} {{product.priceRange.minVariantPrice.currencyCode}}</span>
        </div>
        <div class="product__sticky-top-right">
          <span class="product__sticky-size">{{chosenSize}}</span>
          <span class="product__sticky-color" :data-color="chosenColor">{{chosenColor}}</span>
        </div>
      </div>
      <div class="product__sticky-bottom">
        <input type="number" name="quantity" v-model="quantity">
        <input type="button" name="add-to-cart" v-model="addMessage" @click="addToCart()">
      </div>
    </div>
    <div class="product__select-area">
      <div class="product__option product__option--color">
        <h3>Color</h3>
        <div>
          <span v-for="(color, index) in product.options.color.values"
          :class="color === chosenColor ? 'chosen' : ''"
          @click="chosenColor = color; chooseId()">
            {{color}} · 
          </span>
        </div>
      </div>
      <div class="product__option product__option--size">
        <h3>Size</h3>
        <div>
          <span v-for="(size, index) in product.options.size.values"
          :class="size === chosenSize ? 'chosen' : ''"
          @click="chosenSize = size; chooseId()">
            {{size}} · 
          </span>
        </div>
      </div>
      <div class="product__text product__text--desc">
        <h4>Description</h4>
        <ul>
          <li v-for="(d, index) in desc">{{d}}</li>
        </ul>
      </div>
      <div class="product__text product__text--fit">
        <h4>Fit & Sizing</h4>
        <ul>
          <li v-for="(fs, index) in fitSize">{{fs}}</li>
        </ul>
      </div>
      <div class="product__text product__text--mat">
        <h4>Material & Care</h4>
        <ul>
          <li v-for="(mc, index) in materialCare">{{mc}}</li>
        </ul>
      </div>
      <div class="product__text product__text--feat">
        <h4>Features</h4>
        <ul>
          <li v-for="(f, index) in features">{{f}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

export default Vue.extend({
  data() {
    return {
      quantity: 1,
      isAdding: false
    }
  },
  async asyncData({app, params}) {
    try {
      if(app && app.apolloProvider && app.apolloProvider.defaultClient) {
        let client = app.apolloProvider.defaultClient
        let result = await client.query({
          query: gql`
            query {
              productByHandle(handle: "${params.handle}") {
                handle,
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
        let size = product.options.find((a) => a.name === 'Size')
        let color = product.options.find((a) => a.name === 'Color')
        product.options = {
          size: size,
          color: color
        }
        let newData = {
          product : product,
          chosenColor : '...',
          chosenSize : '...',
          chosenId : '...',
          desc : [],
          fitSize : [],
          materialCare : [],
          features : []
        }
        if(product.variants.edges.length > 1) {
          newData.chosenColor = product.variants.edges[0].node.selectedOptions.find((a) => a.name === 'Color').value
          newData.chosenSize = product.variants.edges[0].node.selectedOptions.find((a) => a.name === 'Size').value
          newData.chosenId = product.variants.edges[0].node.id
        }
        if(product.description.split('|').length > 0) {
          let productText = product.description.split('|')
          newData.desc = productText[0].split('///')
          newData.fitSize = productText[1].split('///')
          newData.materialCare = productText[2].split('///')
          newData.features = productText[3].split(',')
        }
        return newData
      }
      else {
        return { product : {} }
      }
    } catch(err) {
      console.error(err)
      return { product : {} }
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
      console.log(`Adding ${this.product.title} to cart...`)
      this.isAdding = true
      // If this id is already in the cart, increase the quantity of it before sending to Shopify
      let cartIds = this.$store.getters.cartIds.map((a) => {
        if(a.variantId === this.chosenId) {
          a.quantity += parseInt(this.quantity)
          return a
        }
        else {
          return a
        }
      })

      // If this id is not in the cart, add it to the cartIds that are sent to Shopify
      if(!cartIds.some((a) => {
        return a.variantId === this.chosenId
      })) {
        cartIds = [...cartIds, ...[{variantId: this.chosenId, quantity: parseInt(this.quantity)}]]
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
      console.log(`Added ${this.product.title} to cart.`)
      this.$store.dispatch('fetchCart')
    },
    chooseId() {
      let chosenVariant = this.product.variants.edges.find((a) => {
        let colorOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Color'
        })
        let sizeOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Size'
        })
        return this.chosenColor === colorOpt.value && this.chosenSize === sizeOpt.value
      })
      this.chosenId = chosenVariant.node.id
    }
  }
})
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

.product__select-area {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: 50vh;

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

</style>
