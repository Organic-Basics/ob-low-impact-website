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
                <span v-for="(color, index) in cleanOptions.color.values"
                :class="color === propsProduct.chosenColor ? 'chosen' : ''"
                @click="chooseColor(color, propsIdx)">
                  {{color}} · 
                </span>
              </div>
            </div>
            <!-- Size -->
            <div class="product__main--option product__main--color">
              <h6 class="product__main--option--title">Size</h6>
              <div class="product__main--option-picker">
                <span v-for="(size, index) in cleanOptions.size.values"
                :class="size === propsProduct.chosenSize ? 'chosen' : ''"
                @click="chooseSize(size, propsIdx)">
                  {{size}} · 
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Button area -->
      <div class="product__main--button-area">
        <div class="product__main--buttons">
          <button class="product__main--add-to-cart" type="button" name="add-to-cart" @click="addFromChild">Add to cart</button>
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
      <div class="product__text product__text--desc">
        <h4 @click="descOpen = !descOpen">Description</h4>
        <ul v-if="descOpen">
          <li v-for="(d, index) in propsProduct.tabs.desc">{{d}}</li>
        </ul>
      </div>
      <div class="product__text product__text--fit">
        <h4 @click="fitOpen = !fitOpen">Fit & Sizing</h4>
        <ul v-if="fitOpen">
          <li v-for="(fs, index) in propsProduct.tabs.fitSize">{{fs}}</li>
        </ul>
      </div>
      <div class="product__text product__text--mat">
        <h4 @click="careOpen = !careOpen">Material & Care</h4>
        <ul v-if="careOpen">
          <li v-for="(mc, index) in propsProduct.tabs.materialCare">{{mc}}</li>
        </ul>
      </div>
      <div class="product__text product__text--feat">
        <h4 @click="featOpen = !featOpen">Features</h4>
        <ul v-if="featOpen">
          <li v-for="(f, index) in propsProduct.tabs.features">{{f}}</li>
        </ul>
      </div>
    </div>

    <!-- Upsells -->
    <div class="product__upsells text--left">
      <h4>Save with packs</h4>
        <a href="#">
          <div class="product__upsells--bundle">
            <div class="product__upsells--left">
              <img src="" alt="">
            </div>
            <div class="product__upsells--right">
              <div class="product__upsells--right-left">
                <h6 class="product__upsells--product-title"></h6>
                <div>
                    <div class="product__upsells--prices">
                      <span class="product__upsells--price">€70.00</span>
                      <span class="product__upsells--price-compare">€80.00</span>
                    </div>
                    <span class="product__upsells--button">Upgrade</span>
                </div>
              </div>
            </div>
          </div>
        </a>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProductSelect',
  props: {
    propsProduct: Object,
    propsIdx: Number
  },
  data() {
    return {
      descOpen: false,
      fitOpen: false,
      careOpen: false,
      featOpen: false
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
    addFromChild() {
      this.$emit('addFromChild')
      this.isAdding = true
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
    margin-bottom: 30px;

    .product__main--option {
      align-items: flex-start;
      display: flex;
      flex-direction: column;

      &.product__main--size {
        margin-bottom: 30px;
      }

      .chosen {
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
      margin-bottom: 5px;

      ul {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        padding: 0;
        text-align: left;
      }
    }
  }

}

</style>
