<template>
  <div class="product__container">
    <div class="product__slideshow" @click="showImages()">
      <div v-html="productIllustration" v-if="!shouldShowImages && productIllustration"></div>
      <div class="product__image-label" v-if="!shouldShowImages">
        <span class="product__image-label--bold">
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'">Tap to see real photos</span>
          <span v-else>Real photos unavailable</span>
        </span>
        <span>
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'">
            (~{{ ($store.state.carbonIntensity.intensity.index === 'very low' ? highResCost : lowResCost).toFixed(2)}}g CO2)
          </span>
          <span v-else>
            (Our server energy mix needs to be more green)
          </span>
        </span>
      </div>
      <div v-for="(image, index) in mainProduct.images.edges">
        <img :src="shouldShowImages ? image.node.transformedSrc : ''" v-if="shouldShowImages">
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
          <div :class="'product__sticky-color variant--' + [ products[0].chosenColor.toLowerCase().split(' ').join('') ]">
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
    :key="index" :propsIdx="index" :propsProduct="prod" :propsUpSells="upSells"
    @sizeClicked="onSizeChosen" @colorClicked="onColorChosen" @switched="switchId = switchId == 1 ? 2 : 1" @addToCartFromChild="addToCart()"/>

    <section class="product__content-block text--left">
      <div class="content-block__text">
        <h3 class="content-block__title">Lorem ipsum</h3>
        <h6 class="content-block__desc">Created in premium Italian recycled nylon which takes 80% less water to make and creates 90% fewer CO2 emissions in comparison to the virgin fabric. It’s a minimal visible pantyline with a minimal environmental impact.</h6>
      </div>
    </section>

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
      switchId: 1,
      shouldShowImages: false
    }
  },
  components: {
    ProductSelect
  },
  async asyncData({app, params}) {
    try {
      if(app && app.apolloProvider) {
        await app.store.dispatch('fetchCarbonIntensity')
        // Use hi-res images on very low carbon intensity
        let imageScale = app.store.state.carbonIntensity.intensity.index === 'very low' ? 2 : 1

        let client = app.apolloProvider.clients[params.locale]
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
                      transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER, scale: ${imageScale})
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
                      id,
                      availableForSale
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

          let bundleTags = []
          for(let tag of product.tags) {
            // Bundle Tags are tags with 'quant' or 'combo' in them
            // and with more than 5 characters
            if((tag.includes('combo') || tag.includes('quant')) && tag.length > 5) {
              let parsedTag = tag.split('-').splice(0, 2)
              bundleTags.push(`tag:'${parsedTag}'`)
            }
          }

          let bundleTagsStr = bundleTags.join(' OR ')
          let upSellsResult = await client.query({
            query: gql`{
              products(query: "${bundleTagsStr} AND (NOT tag:'combo' OR NOT tag:'quant')", first: 15) {
                edges {
                  node {
                    title,
                    handle,
                    variants(first: 1) {
                      edges {
                        node {
                          priceV2 {
                            amount,
                            currencyCode
                          }
                          compareAtPriceV2 {
                            amount,
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`
          })

          newData.upSells = upSellsResult.data.products.edges
        }
        else {
          let bundleResult = await client.query({
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
                            id,
                            availableForSale
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          })
          let bundleProducts = bundleResult.data.products.edges

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

        // Load product illustration
        let illuHandle = params.handle
        if(illuHandle.includes('accessories') || illuHandle.includes('socks')) {
          illuHandle = illuHandle.replace(/womens-/g, '').replace(/mens-/g, '')
        }

        try {
          let productSvg = await import('~/assets/svg/products/' + illuHandle + '.svg?raw')
          if(productSvg.default) newData.productIllustration = productSvg.default
          else newData.productIllustration = ''
        } catch(err) {
          console.error(err)
          newData.productIllustration = ''
        }

        newData.upSells = newData.upSells ? newData.upSells : []

        return newData
      }
      else {
        return {
          mainProduct : {
          	images : {
          		edges : [{
          			node : {
          				transformedSrc: ''
          			}
          		}]
          	},
          	title : '',
            productIllustration: '',
          	priceRange : {
          		minVariantPrice : {
          			amount : '',
          			currencyCode : ''
          		}
          	}
          },
          upSells : [],
          products : [],
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
        mainProduct : {
        	images : {
        		edges : [{
        			node : {
        				transformedSrc: ''
        			}
        		}]
        	},
        	title: '',
          productIllustration: '',
        	priceRange : {
        		minVariantPrice : {
        			amount : '',
        			currencyCode : ''
        		}
        	}
        },
        upSells : [],
        products : [],
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
    },
    // g CO2 per byte: 0,000002318
    // Avg per low image: 6,5 kb => 6656 bytes
    // Avg per high image: 22 kb => 22528 bytes
    highResCost () {
      const co2PerHighImage = 0.05
      return this.mainProduct.images.edges.length * co2PerHighImage
    },
    lowResCost () {
      const co2PerLowImage = 0.015
      return this.mainProduct.images.edges.length * co2PerLowImage
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

    showImages () {
      console.log('shouldShowImages: ' + this.shouldShowImages)
      this.shouldShowImages = this.$store.state.carbonIntensity.intensity.index === 'high' ? false : true
    },

    updateChosenId(idx) {
    	/*for(let i = 0; i < this.products.length; i++) {
    		let chosenVariant = this.products[i].variants.edges.find((a) => {
	    	  let colorOpt = a.node.selectedOptions.find((b) => {
	    	    return b.name === 'Color'
	    	  })
	    	  let sizeOpt = a.node.selectedOptions.find((b) => {
	    	    return b.name === 'Size'
	    	  })
	    	  return this.products[i].chosenColor === colorOpt.value && this.products[i].chosenSize === sizeOpt.value
	    	})
	    	this.products = this.products.map((a, i) => {
	    		if(i === idx) {
	    			a.chosenId = chosenVariant.node.id
	    		}
	    		return a
	    	})
    	}*/
    	/*let chosenVariant = this.propsProduct.variants.edges.find((a) => {
    	  let colorOpt = a.node.selectedOptions.find((b) => {
    	    return b.name === 'Color'
    	  })
    	  let sizeOpt = a.node.selectedOptions.find((b) => {
    	    return b.name === 'Size'
    	  })
    	  return data.dataColor === colorOpt.value && this.dataSize === sizeOpt.value
    	})

    	console.log('onIdChosen')
    	console.log(data)
    	// TODO: What is going on? Why is it updating both
    	this.products = this.products.map((a, i) => {
    		if(i === data.idx) {
    			console.log(i + '/' + data.idx)
    			a.chosenId = data.id
    		}
    		return a
    	})
      console.log(this.products[0].chosenColor + ' / ' + this.products[0].chosenSize)
      console.log(this.products[1].chosenColor + ' / ' + this.products[1].chosenSize)*/
    },

    onSizeChosen(data) {
    	console.log(data)
    	this.products = this.products.map((a, i) => {
    		if(i === data.idx) {
    			a.chosenSize = data.size
    		}
    		return a
    	})
    	this.updateChosenId(data.idx)
    },

    onColorChosen(data) {
    	console.log(data)
    	this.products = this.products.map((a, i) => {
    		if(i === data.idx) {
    			a.chosenColor = data.color
    		}
    		return a
    	})
    	this.updateChosenId(data.idx)
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

  let quantProducts = []

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

      if(productBundleTag.includes('quant')) {
      	let quantCount = parseInt(productBundleTag.split('-')[4])
      	let quantProduct = JSON.parse(JSON.stringify(products[0]))
      	for(let j = 0; j < quantCount - 1; j++) quantProducts.push(quantProduct)
      }
    }
  }

  products = products.concat(quantProducts)

	if(bundleData) {
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
	}

  return products
}
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.product__container {
  background: #fff;
}

.container-carbon--high .product__image-label {
  color: map-get($colors, 'carbonHigh');
}

.header {
  position: absolute;
  top: 0;
}

.product__slideshow {
  display: flex;
  overflow-x: scroll;
  position: relative;
  width: 100vw;

  .product__image-label {
    bottom: 25px;
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100vw;

    .product__image-label--bold {
      font-weight: bold;
    }

    > span {
      display: block;
      max-width: 75vw;
    }
  }

  > div {
    align-items: center;
    background: map-get($colors, 'productGrey');
    display: flex;
    justify-content: center;
  }

  svg {
    width: 100vw;

    *[stroke*="#"] {
      stroke: map-get($colors, 'black') !important;
    }

    *[fill*="#"] {
      fill: map-get($colors, 'brand') !important;
    }
  }

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
        border-radius: 50px;

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

    .variant--chosen {
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

.product__content-block {
  background: rgb(167, 143, 122);
  height: 500px;
  padding: 5vw 20px;
  color: #fff;
  width: 100%;

  .content-block__text {
    justify-content: space-around;
    display: flex;
    flex-direction: column;
    height: 100%;

    .content-block__title {
      width: 95%;
      color: #fff;
      font-size: 26px;
    }

    .content-block__desc {
      font-size: 16px;
      max-width: 350px;
      color: #fff;
      margin-top: 20px;
    }
  }
}

.footer__container {
  margin-bottom: 90px;
}

</style>
