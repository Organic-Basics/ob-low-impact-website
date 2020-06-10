<template>
  <div class="product__selection">
    <div class="product__main--top" v-if="isSingleProd || propsProduct.key == 0">
      <div>
          <h4 class="product__title">{{mainProduct.title}}</h4>
          <!-- Disabled for now until we can merge the fix -->
          <span class="product__one-liner product__description--desktop" v-if="false">Our best-selling organic cotton bra. No wires — yet plenty of support.</span>
      </div>
      <h3 class="product__main--price">{{parseInt(mainProduct.priceRange.minVariantPrice.amount)}} {{mainProduct.priceRange.minVariantPrice.currencyCode}}
        <span class="product__main--compare-price" v-if="mainProduct.variants.edges[0].node.compareAtPrice !== null && mainProduct.variants.edges[0].node.compareAtPrice !== '0.00'">
          {{ mainProduct.variants.edges[0].node.compareAtPrice }} {{mainProduct.priceRange.minVariantPrice.currencyCode}}
        </span>
      </h3>
    </div>
    <div class="product__main--form">
      <!-- Disabled for now until we can merge the fix -->
      <div v-if="isSingleProd && false">
        <h6 class="product__one-liner product__description--mobile">Clean-cut, seamless look and feel thongs made with recycled materials.</h6>
      </div>
      <!-- Single product selection -->
      <div v-if="isSingleProd" class="product__main--selection-container">
        <div class="product__main--selection">
          <div class="product__main--option-container">
            <!-- Color -->
            <div class="product__main--option product__main--color">
              <h6 class="product__main--option--title">Color<span v-if="propsProduct.chosenColor">: <span class="product__color-choice">{{propsProduct.chosenColor}}</span></span>
              </h6>
              <div class="product__main--option-picker">
                <span v-for="(color, index) in cleanOptions.color.values" @click="chooseColor(color, propsIdx)"
                  :class="['variant__selector', color === propsProduct.chosenColor ? 'variant--chosen' : '']">
                  <span class="variant__selector--border"></span>
                  <span :class="'variant__selector--center variant--' + color.toLowerCase().split(' ').join('')"></span>
                </span>
              </div>
            </div>
            <!-- Size -->
            <div class="product__main--option product__main--size">
              <h6 class="product__main--option--title">Size</h6>
              <div class="product__main--option-picker">
                <span v-for="(size, index) in cleanOptions.size.values" :class="['variant__size', size === propsProduct.chosenSize ? 'variant--chosen' : '', oosSizes.includes(size) ? 'variant--oos' : '']" @click="chooseSize(size, propsIdx)">{{ size }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bundle selection -->
      <div v-if="!isSingleProd" class="bundle__selection product__main--selection-container">
        <div class="product__main--selection">
          <div class="product__bundle--container">
            <div class="product__bundle--top">
              <div :class="{'product__bundle--title': true, 'product--open': propsProduct.isProdOpen}"
                @click="toggleBundleProd()">
                <!-- Title -->
                <div class="product__bundle--left-desktop">
                  <div class="product__bundle--title-left">
                    <span class="product__bundle--title-left-main">
                      <span
                        :class="
                          'product__bundle--circle variant--' +
                            (!propsProduct.chosenColor ? '' : propsProduct.chosenColor.toLowerCase().split(' ').join('') + 'product__circle--active')">
                        <span class="product__bundle--index">{{propsProduct.listIndex + 1}}</span>
                      </span>
                      <span class="product__bundle--check"></span>
                      <span class="product__bundle--plus"></span>
                    </span>
                    <h5 class="product__bundle--title-txt-mobile">{{ propsProduct.title }}</h5>
                  </div>
                </div>
              </div>
              <!-- Info | Summary -->
              <div @click="toggleBundleTabs()" class="product__bundle--title-right product__choice--summary">
                <span
                  class="product__bundle--choice-color"
                  v-if="!propsProduct.isProdOpen">{{ propsProduct.chosenColor }}</span>
                <span
                  v-if="propsProduct.chosenColor && propsProduct.chosenSize && !propsProduct.isProdOpen">
                  /
                </span>
                <span
                  class="product__bundle--choice-size"
                  v-if="!propsProduct.isProdOpen">{{ propsProduct.chosenSize }}</span>
                <span class="product__mobile--more-info" :class="{ closed: !propsProduct.isProdOpen }">
                  <span class="product__mobile--more-info-txt">{{!isTabOpen ? "Info" : "Close"}}</span>
                  <span class="product__mobile--circle">
                    <span v-if="!isTabOpen" class="product__mobile--plus">+</span>
                    <span v-if="isTabOpen" class="product__mobile--close">+</span>
                  </span>
                </span>
              </div>
            </div>
            <!-- Accordion option container -->
            <div
              class="product__main--option-container"
              :class="propsProduct.isProdOpen && !isTabOpen ? 'open' : 'closed'">
              <span class="product__bundle-switch" @click="switchProduct" v-if="propsProduct.switchId != 0 && propsProduct.switchId !== undefined">Switch to {{ propsProduct.switchProduct.title }}</span>
              <div class="product__main--options">
                <!-- Color -->
                <div class="product__main--option product__main--color">
                  <h6 class="product__main--option--title product__main--option--mobile">Color<span v-if="propsProduct.chosenColor">:
                      <span class="product__color-choice">{{propsProduct.chosenColor}}</span></span></h6>
                  <div class="product__main--option-picker">
                    <span
                      v-for="(color, index) in cleanOptions.color.values"
                      @click="chooseColor(color, propsIdx)"
                      :class="['variant__selector', color === propsProduct.chosenColor ? 'variant--chosen' : '']">
                      <span class="variant__selector--border"></span>
                      <span :class="'variant__selector--center variant--' + color.toLowerCase().split(' ').join('')"></span>
                    </span>
                  </div>
                </div>
                <!-- Size -->
                <div class="product__main--option product__main--size">
                  <h6 class="product__main--option--title">Size</h6>
                  <div class="product__main--option-picker">
                    <span
                      v-for="(size, index) in cleanOptions.size.values"
                      :class="[
                        'variant__size',
                        size === propsProduct.chosenSize ? 'variant--chosen' : '',
                        oosSizes.includes(size) ? 'variant--oos' : ''
                      ]"
                      @click="chooseSize(size, propsIdx)"
                    >
                      {{ size }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Product tabs -->
            <div
              class="product__mobile--tabs"
              :class="propsProduct.isProdOpen && isTabOpen ? 'open' : 'closed'"
            >
              <ProductTabs :propsProduct="propsProduct" />
            </div>
          </div>
        </div>
      </div>
      <!-- Button area -->
      <div v-if="isSingleProd || propsProduct.isLastProduct" class="product__main--button-area">
        <div class="product__main--buttons">
          <button class="product__main--add-to-cart" name="add-to-cart" @click="addToCartFromChild">{{addMessage}}</button>
        </div>
      </div>
      <!-- Tabs -->
      <ProductTabs v-if="isSingleProd" :propsProduct="propsProduct" />

      <div class="product__main--extra" v-if="propsProduct.isLastProduct">
        <span class="product__main--shipping">
          Free CO2 neutral worldwide shipping available.
        </span>
        <span class="product__main--sizeguide" @click="$emit('sizeGuideOpened')">
          <div class="size-guide-cta">
            Size Guides
          </div>
        </span>
      </div>

    </div>
    <!-- Upsells -->
    <div class="product__upsells text--left" v-if="propsUpSells.length > 0">
      <h4 class="product__upsells--title">Save with packs</h4>
      <nuxt-link
        :to="`/${$store.state.activeCurrency}/products/${upSell.node.handle}`"
        v-for="(upSell, index) in propsUpSells"
        :key="index"
      >
        <div class="product__upsells--bundle">
          <div class="product__upsells--left">
            <div
              :class="{product__illustration: true, quantityBundle: upSell.node.quantity}"
              v-for="illu in upSell.node.bundleIllustrations"
              v-html="illu"
              v-if="!upSell.node.quantity"
            ></div>
            <div
              :class="{product__illustration: true, quantityBundle: upSell.node.quantity, five: upSell.node.quantity === 5}"
              v-for="n in upSell.node.quantity"
              v-html="upSell.node.bundleIllustrations[0]"
              v-if="upSell.node.quantity"
            ></div>
            <!-- <span class="product__image-quant variant--black" v-if="upSell.node.quantity">
              <span class="product__bundle--quant">
                x{{ upSell.node.quantity }}
              </span>
            </span> -->
          </div>
          <div class="product__upsells--right">
            <div class="product__upsells--right-left">
              <h6 class="product__upsells--product-title">
                {{ upSell.node.title }}
              </h6>
              <div>
                <div class="product__upsells--prices">
                  <span class="product__upsells--price">
                    {{
                      formatPrice(
                        upSell.node.variants.edges[0].node.priceV2.amount,
                        upSell.node.variants.edges[0].node.priceV2.currencyCode
                      )
                    }}
                  </span>
                  <span
                    class="product__upsells--price-compare"
                    v-if="
                      upSell.node.variants.edges[0].node.compareAtPriceV2 !==
                        null
                    "
                  >
                    {{
                      formatPrice(
                        upSell.node.variants.edges[0].node.compareAtPriceV2
                          .amount,
                        upSell.node.variants.edges[0].node.compareAtPriceV2
                          .currencyCode
                      )
                    }}
                  </span>
                </div>
                <span class="product__upsells--button">Upgrade</span>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
      <div class="product__upsells--gender">
        <nuxt-link
          :to="
            `${$store.state.activeCurrency}/collections/womens-save-with-packs`
          "
          v-if="$route.params.handle.includes('womens')"
        >
          View all Women's packs
        </nuxt-link>
        <nuxt-link
          :to="
            `${$store.state.activeCurrency}/collections/mens-save-with-packs`
          "
          v-else
        >
          View all Men's packs
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import ProductTabs from '~/components/Product/ProductTabs.vue'

export default Vue.extend({
  name: "ProductSelect",
  components: {
    ProductTabs
  },
  data() {
    return {
      isTabOpen: false
    };
  },
  props: {
    propsProduct: Object,
    propsIdx: Number,
    productData: Object,
    propsUpSells: Array,
    isSingleProd: Boolean,
    mainProduct: Object,
    addMessage: String
  },
  computed: {
    cleanOptions() {
      let size = this.propsProduct.options.find(a => a.name === "Size");
      let color = this.propsProduct.options.find(a => a.name === "Color");

      return {
        size: size,
        color: color
      };
    },
    oosSizes() {
      let oosVariants = this.propsProduct.variants.edges.filter(a => {
        let colorOpt = a.node.selectedOptions.find(b => {
          return b.name === "Color";
        });
        return (
          this.propsProduct.chosenColor === colorOpt.value &&
          !a.node.availableForSale
        );
      });
      return oosVariants.map(a => {
        let sizeOpt = a.node.selectedOptions.find(b => {
          return b.name === "Size";
        });
        return sizeOpt.value;
      });
    }
  },
  methods: {
    chooseColor(color) {
      this.$emit("colorClicked", {
        color: color,
        idx: this.propsIdx
      });
    },
    chooseSize(size) {
      if (!this.oosSizes.includes(size)) {
        this.$emit("sizeClicked", {
          size: size,
          idx: this.propsIdx
        });
      }
    },
    addToCartFromChild() {
      this.$emit("addToCartFromChild", {
        idx: this.propsIdx
      });
      this.isAdding = true;
    },
    formatPrice(amount, currencyCode) {
      let price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode
      }).format(amount);

      if (currencyCode === "DKK") price = price.replace(".00", "");
      return price;
    },
    switchProduct() {
      this.$emit("switched");
      this.propsProduct.switchProduct.isProdOpen = true;
    },
    toggleBundleProd() {
      this.$emit("productToggled", {
        idx: this.propsIdx
      });
    },
    toggleBundleTabs() {
      this.isTabOpen = !this.isTabOpen;
    }
  }
});
</script>
<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.product__main {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 50vw;
  padding: 7vw 7vw 0;
  background: #fff;
  text-align: left;
  margin-top: 62px;

  @include screenSizes(tabletPortrait) {
    width: 100vw;
    padding: 20px;
    margin-top: 0;
  }

  .product__selection {
    width: 100%;
  }

  .product__main--top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    position: relative;
    margin-bottom: 50px;

    @include screenSizes(tabletPortrait) {
      display: none;
    }

    .product__title {
      text-align: left;
      width: 100%;
      margin-bottom: 0;
    }

    // Disabled for now until we can merge the fix on Github
    .product__one-liner {
      height: 0;
    }

    .product__description--desktop {
      text-align: left;
      color: map-get($colors, 'darkGrey');
      max-width: 28vw;
      font-size: 13px;
      margin: 10px 0;
      display: block;
    }

    .product__main--price {
      font-size: 20px;
      margin: 0 0 0 10px;
      width: 110px;
      text-align: right;
    }

    .product__main--compare-price {
      text-decoration: line-through;
      color: map-get($colors, 'darkGrey');
      font-size: 18px;
    }
  }

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

  .product__main--form {
    width: 100%;

    .product__description--mobile {
      display: none;

      @include screenSizes(tabletPortrait) {
        text-align: center;
        color: map-get($colors, 'darkGrey');
      }
    }

    .product__main--option {
      align-items: flex-start;
      display: flex;
      flex-direction: column;

      &.product__main--size {
        @include screenSizes(tabletPortrait) {
          margin-bottom: 30px;
        }
      }
    }

    .product__main--selection-container {
      margin-top: 30px;

      @include screenSizes(tabletPortrait) {
        margin-top: 0;
      }

      .product__main--option-container {
        margin-top: 0;
        display: flex;
        flex-direction: row;

        .product__main--options {
          display: inherit;
          margin-bottom: 10px;

          @include screenSizes(tabletPortrait) {
            flex-direction: column;
            width: 100%;
          }
        }

        @include screenSizes(tabletPortrait) {
          display: block;
        }

        .product__main--option {
          flex-basis: 100%;
          display: block;

          .product__main--option--title {
            padding: 1rem 0 .5rem;

            @include screenSizes(tabletPortrait) {
              border-bottom: 1px solid map-get($colors, 'brand');
            }
          }

          .product__main--option-picker {
            margin-top: 1rem;
            display: flex;
            flex-direction: row;
            margin-right: 15px;

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
                border: 2px solid map-get($colors, "black");
              }

              .variant__selector--center {
                transform: scale(0.73333);
              }
            }
          }
        }

        .product__main--size {
          .product__main--option-picker {
            margin-top: 1.5rem;

            @include screenSizes(tabletPortrait) {
              margin-top: 1rem;
            }
          }

          .variant__size:first-of-type {
            margin-left: 0;
          }

          .variant__size {
            margin: 0 10px;
            cursor: pointer;
            text-decoration: none;
          }

          .variant--chosen {
            border-bottom: 2px solid map-get($colors, "black");
          }

          .variant--oos {
            color: map-get($colors, "brand");
            cursor: not-allowed;
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
          border: none;
        }
      }
    }
  }

  /* Bundles */

  .bundle__selection {
    margin-top: 0 !important;

    .product__main--form {
      border-top: 1px solid map-get($colors, 'brand');
      margin-top: 0;
      padding: 1.5rem 0;
    }

    .product__main--selection {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .closed {
        display: none !important;
      }

      .product__bundle-switch {
        color: map-get($colors, "darkGrey");
        margin-top: 10px;
        margin-bottom: 20px;
      }

      .product__bundle--top {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-top: 1px solid map-get($colors, 'brand');
        margin-top: 0;
        padding: 1.5rem 0;

        @include screenSizes(tabletPortrait) {
          border-top: none;
        }
      }

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
      }

      .product__bundle--circle,
      .product__mobile--circle {
        display: inline-flex;
        justify-content: center;
        font-weight: bold;
        align-items: center;
        border: 1.5px solid map-get($colors, "black");
        border-radius: 50%;
        height: 26.5px;
        width: 26.5px;
        font-size: 17px;

        &.product__circle--active {
          border: none;
          color: #fff;

          &.variant--white {
            color: map-get($colors, "black");
          }
        }

        .product__bundle--index {
          display: inline;
          width: auto;
          font-size: 0.9rem;
        }

        .product__mobile--close {
          transform: rotate(45deg);
        }
      }

      .product__main--size {
        margin-bottom: 0;
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

        .product__bundle--choice-color,
        .product__bundle--choice-size {
          font-size: 13px;
          padding-right: 2px;
        }

        .product__bundle--choice-color + span {
          padding: 0 2px;
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

      .product__main--option-container {
        display: flex;
        width: 100%;
        margin-bottom: 1vw;
        flex-wrap: wrap;
        align-items: baseline;

        .product__main--option {
          flex-basis: auto;

          @include screenSizes(tabletPortrait) {
            flex-basis: 100%;
          }
        }

        .product__main--option--title {
          font-size: 13px;
        }

        .product__main--option-radio {
          display: none;
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
        background: map-get($colors, "productGrey");
        display: flex;
        flex-basis: auto;
        margin-right: 1rem;
        min-height: 180px;
        overflow: hidden;
        flex: 1;
        position: relative;
        min-width: 150px;

        .product__illustration {
          background: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 50%;
          flex-grow: 1;
          position: relative;

          svg {
            *[stroke*="#"] {
              stroke: map-get($colors, "black") !important;
            }

            *[fill*="#"] {
              fill: map-get($colors, "productGrey") !important;
            }

            // Tennis Socks fix
            *[fill*="#999"] {
                fill: map-get($colors, "black") !important;
            }
          }

          &:first-child {
            top: 10%;
          }
          &:last-child {
            bottom: 10%;
          }

          &.quantityBundle {
            max-width: 50%;
            min-width: 50%;
            position: absolute;
            // top:50%;
            // right: 50%;
            width: 40%;
            height: 50%;

            &:first-child {
              top: 10%;
              left: 5%;
            }
            &:nth-child(2) {
              top: 25%;
              left: 25%;
            }
            &:last-child {
              bottom: 10%;
              right: 5%;
            }

            &.five {
              &:first-child {
                top: 0%;
                left: 0%;
              }
              &:nth-child(2) {
                top: 12%;
                left: 12%;
              }
              &:nth-child(3) {
                top: 25%;
                left: 25%;
              }

              &:nth-child(4) {
                bottom: 12%;
                right: 12%;
              }
              &:last-child {
                bottom: 0%;
                right: 0%;
              }
            }
          }
        }
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
              color: map-get($colors, "brand");
            }
          }
        }

        .product__upsells--button {
          display: inline-block;
          line-height: 36px;
          width: 100%;
          padding: 3px;
          text-align: center;
          transition: 0.3s;
          font-size: 15px;
          color: #fff;
          background: map-get($colors, "black");
        }
      }
    }

    .product__upsells--gender {
      margin-top: 20px;
      text-align: left;
      border-bottom: 1px solid black;
      width: fit-content;

      @include screenSizes(tabletPortrait) {
        text-align: center;
      }
    }
  }
}
</style>
