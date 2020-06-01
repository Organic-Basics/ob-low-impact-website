<template>
  <section class="product__main">
    <div class="product__main--form">
      <div>
        <h6 class="product__top--description">Clean-cut, seamless look and feel thongs made with recycled materials.</h6>
      </div>

      <!-- Selection -->
      <div class="product__main--selection-container">
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
                :class="['variant__size', size === propsProduct.chosenSize ? 'variant--chosen' : '']"
                @click="chooseSize(size, propsIdx)">
                  {{size}}
                </span>
              </div>
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
      <div class="product__text product__text--feat">
        <div @click="toggleTab('featOpen')" :class="{'product__tabs--title': true, 'tab--open':(featOpen == true)}">
          <h6>Features</h6>
          <h5 class="tab__plus">+</h5>
        </div>
        <ul v-if="featOpen" class="tab__feat">
          <li v-for="(f, index) in propsProduct.tabs.features">
            <div class="tab__feat--title">
              <div class="tab__feat--left" v-for="(feat) in features"
                v-if="f.toLowerCase().trim() == feat.name.toLowerCase().trim()"
                @click="toggleFeat(feat)">
                <img class="tab__feat--icon"
                  :src="feat.icon" :alt="feat.name" />
                  {{f}}
              </div>
              <h5 class="tab__plus">+</h5>
            </div>
            <div class="tab__feat--desc" v-for="(feat) in features"
              v-if="feat.isOpen && f.toLowerCase().trim() == feat.name.toLowerCase().trim()">
              {{feat.desc}}
            </div>
          </li>
        </ul>
      </div>
      <div class="product__text product__text--desc">
        <div @click="toggleTab('descOpen')" :class="{'product__tabs--title': true, 'tab--open':(descOpen == true)}">
          <h6>Description</h6>
          <h5 class="tab__plus">+</h5>
        </div>
        <ul v-if="descOpen">
          <li v-for="(d, index) in propsProduct.tabs.desc">{{d}}</li>
        </ul>
      </div>
      <div class="product__text product__text--fit">
        <div @click="toggleTab('fitOpen')" :class="{'product__tabs--title': true, 'tab--open':(fitOpen == true)}">
          <h6>Fit & Sizing</h6>
          <h5 class="tab__plus">+</h5>
        </div>
        <ul v-if="fitOpen">
          <li v-for="(fs, index) in propsProduct.tabs.fitSize">{{fs}}</li>
        </ul>
      </div>
      <div class="product__text product__text--mat">
        <div @click="toggleTab('careOpen')" :class="{'product__tabs--title': true, 'tab--open':(careOpen == true)}">
          <h6>Material & Care</h6>
          <h5 class="tab__plus">+</h5>
        </div>
        <ul v-if="careOpen">
          <li v-for="(mc, index) in propsProduct.tabs.materialCare">{{mc}}</li>
        </ul>
      </div>
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

export default Vue.extend({
  name: 'ProductSelect',
  props: {
    propsProduct: Object,
    propsIdx: Number,
    productData: Object,
    propsUpSells: Array,
  },
  data: () => {
    return {
      descOpen: false,
      fitOpen: false,
      careOpen: false,
      featOpen: true,
      featDescOpen: false,
      features: [
        {
          name: 'Organic',
          icon: require('~/assets/svg/feature.organic.svg'),
          desc: "We've used GOTS certified organic cotton for this product which comes from the coast of the Aegean Sea. It’s widely regarded as some of the most soft and durable cotton in the world. The GOTS standard also guarantees that the people that made this are paid living wages and treated like humans.",
          isOpen: false
        },
        {
          name: 'Ethically made',
          icon: require('~/assets/svg/feature.ethicallymade.svg'),
          desc: "Made in better working conditions with living wages, no child labor, freely chosen employment and respect for the environment. We use the GOTS and SA8000 standards to ensure that things are made fairly.",
          isOpen: false
        },
        {
          name: 'PETA "Vegan Approved"',
          icon: require('~/assets/svg/feature.peta.svg'),
          desc: 'The PETA "Vegan Approved" logo indicates that the product is cruelty-free - and that it does not contain any animal products or by-products.',
          isOpen: false
        },
        {
          name: 'TENCEL™',
          icon: require('~/assets/svg/feature.tencel.svg'),
          desc: "TENCEL™ is an eco-friendly fiber made from responsibly sourced wood pulp. The wood pulp is dissolved in a closed-loop process with a non-toxic organic solvent, then the solution is forced through tiny holes in order to create a magical biodegradable fiber that feels softer and lighter than cotton.",
          isOpen: false
        },
        {
          name: 'Soft + Breathable',
          icon: require('~/assets/svg/feature.softbreathable.svg'),
          desc: 'TENCEL™ is softer, more breathable and more absorptive than cotton because it is composed of very small fibers. The end result feels like something closer to silk than cotton - which is definitely a good thing.',
          isOpen: false
        },
        {
          name: 'Seamless',
          icon: require('~/assets/svg/feature.seamless.svg'),
          desc: 'This product is knitted in a way that creates no seams. No seams means greater comfort and durability because there are no weak points in the garment.',
          isOpen: false
        },
        {
          name: 'Polygiene® - Stays Fresh',
          icon: require('~/assets/svg/feature.polygiene.svg'),
          desc: 'Our activewear is treated with a safe, permanent, bluesign® approved recycled silver salt called Polygiene® - which stops the growth of odor causing bacteria on the fabric. Polygiene® is not a nano-silver and it has no harmful effect on the environment when washing.',
          isOpen: false
        },
        {
          name: 'Odorless',
          icon: require('~/assets/svg/feature.odorless.svg'),
          desc: "We’ve blended a silver coated polymer thread called SilverTech™ into the organic cotton to stop the growth of odor causing bacteria on the fabric. We use a very small amount of real silver, not nano-silvers for this. SilverTech™ is safe, permanent and it has no harmful effect on the environment when washing.",
          isOpen: false
        },
        {
          name: 'Heat Regulating',
          icon: require('~/assets/svg/feature.heatregulating.svg'),
          desc: "Silver is thermodynamic - which means that our SilverTech™ thread keeps you cooler when it's hot and warmer when it's cold, helping you feel fresh and stay fresh.",
          isOpen: false
        },
        {
          name: 'Recycled materials',
          icon: require('~/assets/svg/feature.recycledmaterials.svg'),
          desc: "We use recycled materials because they save water and energy. They also help divert waste from landfills and prevent CO2 - helping to keep our planet clean and combat climate change.",
          isOpen: false
        }
      ]
    }
  },
  computed: {
    cleanOptions() {
      let size = this.propsProduct.options.find((a) => a.name === 'Size')
      let color = this.propsProduct.options.find((a) => a.name === 'Color')
      return {
        size: size,
        color: color
      }
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
      this.$emit('sizeClicked', {
        size: size,
        idx: this.propsIdx
      })
    },
    addToCartFromChild() {
      this.$emit('addToCartFromChild')
      this.isAdding = true
    },
    toggleTab(tabName) {
      let newState = !this[tabName]
      this.descOpen = false
      this.fitOpen = false
      this.careOpen = false
      this.featOpen = false
      this[tabName] = newState
    },
    toggleFeat(feat) {
      let newState = !feat.isOpen
      this.features = this.features.map((a) => { a.isOpen = false; return a })
      feat.isOpen = newState
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

      .variant--chosen {
        text-decoration: underline;
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

    // TABS
    .product__text {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      margin-top: 20px;

      .product__tabs--title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        border-bottom: 1px solid map-get($colors, 'brand');
        padding-bottom: .5rem;

        .tab__plus {
          transition: transform .25s ease-in-out;
        }
      }

      .tab--open {
        border-bottom: 1.5px solid map-get($colors, 'black');

        .tab__plus {
          transform: rotate(45deg);
        }
      }

      ul {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-left: 20px;
        margin-top: 20px;
        margin-bottom: 8px;

        li {
          list-style: disc;
          color: map-get($colors, 'brand');
          line-height: 20.8px;
          font-size: 13px;
        }
      }

      .tab__feat {
        width: calc(100% + 20px);
        margin-left: -20px;

        .tab__feat--title {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 5px;

          .tab__feat--left {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .tab__feat--icon {
            width: 30px;
            margin-right: 20px;
          }
        }

        .tab__feat--desc {
          margin-left: 50px;
          margin-bottom: 8px;
          color: map-get($colors, 'brand')
        }

        li {
          list-style-type: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          color: map-get($colors, 'black');
        }

        li:nth-child(n+2) {
          margin-top: 20px;
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
