<template>
  <section class="product__main">
    <div class="product__main--form">
      <div>
        <h6 class="product__top--description">Clean-cut, seamless look and feel thongs made with recycled materials.</h6>
      </div>

      <!-- Single product selection -->
      <div v-if="isSingleProd" class="product__main--selection-container">
        <div class="product__main--selection">
          <div class="product__main--option-container">
            <button @click="$emit('switched')" v-if="propsProduct.switchId != 0 && propsProduct.switchId !== undefined">Switch to {{propsProduct.switchProduct}}</button>
            <!-- Color -->
            <div class="product__main--option product__main--color">
              <h6 class="product__main--option--title">Color</h6>
              <div class="product__main--option-picker">
                <span v-for="(color, index) in cleanOptions.color.values" @click="chooseColor(color, propsIdx)"
                  :class="['variant__selector', color === propsProduct.chosenColor ? 'variant--chosen' : '']">
                  <span class="variant__selector--border"></span>
                  <span :class="'variant__selector--center variant--' + [ color.toLowerCase().split(' ').join('') ]"></span>
                </span>
              </div>
            </div>
            <!-- Size -->
            <div class="product__main--option product__main--size">
              <h6 class="product__main--option--title">Size</h6>
              <div class="product__main--option-picker">
                <span v-for="(size, index) in cleanOptions.size.values"
                :class="['variant__size', size === propsProduct.chosenSize ? 'variant--chosen' : '', oosSizes.includes(size) ? 'variant--oos' : '']"
                @click="chooseSize(size, propsIdx)">
                  {{size}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bundle selection -->
      <div v-if="!isSingleProd" class="bundle__selection product__main--selection-container">
        <div class="product__main--selection">
          <div class="product__bundle--container bundle--open">
            <a href="#" class="product__bundle--title">
              <!-- Title -->
              <div class="product__bundle--left-desktop">
                <div class="product__bundle--title-left">
                  <span class="product__bundle--title-left-main">
                    <span class="product__bundle--circle">
                      <span class="product__bundle--index">1</span>
                    </span>
                    <span class="product__bundle--check"></span>
                    <span class="product__bundle--plus"></span>
                  </span>
                  <h5 class="product__bundle--title-txt-mobile">{{propsProduct.title}}</h5>
                </div>
              </div>
              <!-- Info | Summary -->
              <div class="product__bundle--title-right product__choice--summary">
                  <span class="product__bundle--choice-color"></span>
                  <span class="product__bundle--choice-size"></span>
                  <span class="product__mobile--more-info">
                      <span class="product__mobile--more-info-txt">Info</span>
                      <span class="product__mobile--circle">
                          <span class="product__mobile--plus">+</span>
                          <span class="product__mobile--close"></span>
                      </span>
                  </span>
              </div>
            </a>
            <!-- Accordion option container -->
            <div class="product__main--option-container">
              <!-- Color -->
              <div class="product__main--option product__main--color">
                <span class="product__main--option--title product__main--option--mobile">Color</span>
                <div class="product__main--option-picker">
                  <span v-for="(color, index) in cleanOptions.color.values" @click="chooseColor(color, propsIdx)"
                    :class="['variant__selector', color === propsProduct.chosenColor ? 'variant--chosen' : '']">
                    <span class="variant__selector--border"></span>
                    <span :class="'variant__selector--center variant--' + [ color.toLowerCase().split(' ').join('') ]"></span>
                  </span>
                </div>
              </div>
              <!-- Size -->
              <div class="product__main--option product__main--size">
                <h6 class="product__main--option--title">Size</h6>
                <div class="product__main--option-picker">
                  <span v-for="(size, index) in cleanOptions.size.values"
                  :class="['variant__size', size === propsProduct.chosenSize ? 'variant--chosen' : '', oosSizes.includes(size) ? 'variant--oos' : '']"
                  @click="chooseSize(size, propsIdx)">
                    {{size}}
                  </span>
                </div>
              </div>
            </div>
            <!-- Product tabs -->
            <div class="product__mobile--tabs">
              <ProductTabs  :propsProduct="propsProduct" />
            </div>

          </div>
        </div>
      </div>

      <!-- Button area -->
      <div class="product__main--button-area">
        <div class="product__main--buttons">
          <button class="product__main--add-to-cart" type="button" name="add-to-cart" @click="addToCartFromChild">Add to cart</button>
        </div>
        <div class="product__main--extra">
          <span class="product__main--shipping">
            Free CO2 neutral worldwide shipping available.
          </span>
          <span class="product__main--sizeguide">
            <div class="size-guide-cta">
              Size Guide
            </div>
          </span>
        </div>
      </div>

      <!-- Tabs -->
      <ProductTabs v-if="isSingleProd" :propsProduct="propsProduct" />
    </div>

    <!-- Upsells -->
    <div class="product__upsells text--left" v-if="propsUpSells.length > 0">
      <h4 class="product__upsells--title">Save with packs</h4>
        <nuxt-link :to="`/${$store.state.activeCurrency}/products/${upSell.node.handle}`" v-for="(upSell, index) in propsUpSells" :key="index">
          <div class="product__upsells--bundle">
            <div class="product__upsells--left">
              <img src="~/assets/svg/manifesto/manifesto_1.svg" alt="">
            </div>
            <div class="product__upsells--right">
              <div class="product__upsells--right-left">
                <h6 class="product__upsells--product-title">{{upSell.node.title}}</h6>
                <div>
                    <div class="product__upsells--prices">
                      <span class="product__upsells--price">
                        {{formatPrice(upSell.node.variants.edges[0].node.priceV2.amount, upSell.node.variants.edges[0].node.priceV2.currencyCode)}}
                      </span>
                      <span class="product__upsells--price-compare" v-if="upSell.node.variants.edges[0].node.compareAtPriceV2 !== null">
                        {{formatPrice(upSell.node.variants.edges[0].node.compareAtPriceV2.amount, upSell.node.variants.edges[0].node.compareAtPriceV2.currencyCode)}}
                      </span>
                    </div>
                    <span class="product__upsells--button">Upgrade</span>
                </div>
              </div>
            </div>
          </div>
        </nuxt-link>
        <div class="product__upsells--gender">
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/womens-save-with-packs`" v-if="$route.params.handle.includes('womens')">View all Women's packs</nuxt-link>
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/mens-save-with-packs`" v-else>View all Men's packs</nuxt-link>
        </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import ProductTabs from '~/components/ProductTabs.vue'

export default Vue.extend({
  name: 'ProductSelect',
  components: {
    ProductTabs
  },
  props: {
    propsProduct: Object,
    propsIdx: Number,
    productData: Object,
    propsUpSells: Array,
    isSingleProd: Boolean
  },
  computed: {
    cleanOptions() {
      let size = this.propsProduct.options.find((a) => a.name === 'Size')
      let color = this.propsProduct.options.find((a) => a.name === 'Color')

      return {
        size: size,
        color: color
      }
    },
    oosSizes() {
      let oosVariants = this.propsProduct.variants.edges.filter((a) => {
        let colorOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Color'
        })
        return this.propsProduct.chosenColor === colorOpt.value && !a.node.availableForSale
      })
      return oosVariants.map((a) => {
        let sizeOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Size'
        })
        return sizeOpt.value
      })
    }
  },
  methods: {
    chooseColor(color) {
      this.$emit('colorClicked', {
        color: color,
        idx: this.propsIdx
      })
    },
    chooseSize(size) {
      if(!this.oosSizes.includes(size)) {
        this.$emit('sizeClicked', {
          size: size,
          idx: this.propsIdx
        })
      }
    },
    addToCartFromChild() {
      this.$emit('addToCartFromChild', {
        idx: this.propsIdx
      })
      this.isAdding = true
    },
    formatPrice(amount, currencyCode) {
      let price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode
      }).format(amount)

      if(currencyCode === 'DKK') price = price.replace('.00', '')
      return price
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.product__main {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
  text-align: left;

  .product__main--form {

    .product__top--description {
      text-align: center;
      color: map-get($colors, 'darkGrey');
    }

    .product__main--option {
      align-items: flex-start;
      display: flex;
      flex-direction: column;

      &.product__main--size {
        margin-bottom: 30px;
      }
    }

    .product__main--selection-container {
      margin-top: 30px;

      .product__main--option-container {
        margin-top: 0;

        .product__main--option {
          flex-basis: 100%;
          display: block;

          .product__main--option--title {
            border-bottom: 1px solid map-get($colors, 'brand');
            padding: 1rem 0 .5rem;
          }

          .product__main--option-picker {
            margin-top: 1rem;
            display: flex;
            flex-direction: row;

            .variant__selector {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 1rem;
              display: inline-flex;
              position: relative;

              .variant__selector--border {
                border-radius: 40px;
                height: 40px;
                width: 40px;
                position: absolute;
                top: 0;
                left: 0;
              }

              .variant__selector--center {
                border-radius: 40px;
                height: 40px;
                width: 40px;
              }
            }

            .variant--chosen {
              .variant__selector--border {
                border: 2px solid map-get($colors, 'black');
              }

              .variant__selector--center {
                transform: scale(.73333);
              }
            }
          }
        }

        .product__main--size {
          .variant__size:first-of-type {
            margin-left: 0;
          }

          .variant__size {
            margin: 0 10px;
            cursor: pointer;
            text-decoration: none;
          }

          .variant--chosen {
            border-bottom: 2px solid map-get($colors, 'black');
          }

          .variant--oos {
            color: map-get($colors, 'brand');
            cursor: not-allowed;
          }
        }
      }
    }

    /* Bundles */
    .bundle__selection {
      .product__main--selection {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .product__bundle--title {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .product__bundle--title-left {
            align-items: flex-start;
            display: flex;

            .product__bundle--title-txt-mobile {
              margin-left: 10px;
            }

            .product__bundle--title-left-main {
              display: flex;
              font-size: 1.25rem;
              cursor: pointer;
            }
          }

          .product__bundle--circle, .product__mobile--circle {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border: 1.5px solid map-get($colors, 'black');
            border-radius: 50%;
            height: 26.5px;
            width: 26.5px;
            font-size: 17px;

            .product__bundle--index {
              display: inline;
              width: auto;
              font-size: .9rem;
            }
          }

          .product__choice--summary {
            display: flex;
            flex-basis: 28%;
            align-items: flex-end;
            flex-direction: row;
            justify-content: flex-end;
            flex-wrap: wrap;
            font-size: 12px;
            text-align: right;

            .product__bundle--choice-color, .product__bundle--choice-size {
              font-size: 13px;
              padding-right: 2px;
            }

            .product__mobile--more-info {
              display: flex;
              flex-direction: row;
              align-items: center;

              .product__mobile--more-info-txt {
                font-size: 13px;
                margin-right: 7px;
              }
            }
          }
        }

        .product__main--option-container {
          display: flex;
          width: 100%;
          margin-bottom: 1vw;
          flex-wrap: wrap;

          .product__main--option {
            flex-basis: 100%;
          }

          .product__main--option--title {
            font-size: 13px;
            border-bottom: 1px solid map-get($colors, 'brand');
            display: block;
            padding: 1rem 0 .5rem;
          }

          .product__main--option-radio {
            display: none;
          }
        }
      }
    }

    .product__main--button-area {
      margin: 1vw 0 2vw;
      display: block;

      .product__main--buttons {
        display: flex;
        padding-top: 20px;
        opacity: 1;
        justify-content: space-between;
        margin-bottom: 1rem;

        .product__main--add-to-cart {
          flex-basis: 100%;
        }
      }

      .product__main--extra {
        margin-bottom: 2rem;
        margin-top: 20px;display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 13px;

        .product__main--shipping {
          flex-basis: 75%;
          padding-right: 5px;
          color: map-get($colors, 'brand');

        }
      }
    }
  }

  // UPSELLS
  .product__upsells {
    margin-top: 20px;
    margin-bottom: 80px;
    width: 100%;

    .product__upsells--title {
      margin-bottom: 2rem;
    }

    .product__upsells--bundle {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;

      .product__upsells--left {
        flex-basis: auto;
        margin-right: 1rem;
      }

      .product__upsells--right {
        display: flex;
        flex-basis: 69%;
        justify-content: space-between;
        flex-direction: column;
        padding: 10px 0;

        .product__upsells--right-left {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          max-width: 320px;

          .product__upsells--product-title {
            font-size: 14px;
            margin-right: 10px;
          }

          .product__upsells--prices {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-right: 10px;
            font-size: 14px;
            margin-bottom: 10px;

            .product__upsells--price-compare {
              text-decoration: line-through;
              color: map-get($colors, 'brand');
            }
          }
        }

        .product__upsells--button {
          display: inline-block;
          line-height: 36px;
          width: 100%;
          padding: 3px;
          text-align: center;
          transition: .3s;
          font-size: 15px;
          color: #fff;
          background: map-get($colors, 'black');
        }
      }
    }

    .product__upsells--gender {
      margin-top: 20px;
      text-align: center;
    }
  }

}

</style>
