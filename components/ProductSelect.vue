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
            <button @click="$emit('switched')" v-if="product.switchId != 0 && product.switchId !== undefined">Switch to {{product.switchProduct}}</button>
            <!-- Color -->
            <div class="product__main--option product__main--color">
              <h6 class="product__main--option--title">Color</h6>
              <div class="product__main--option-picker">
                <span v-for="(color, index) in cleanOptions.color.values"
                :class="color === chosenColor ? 'chosen' : ''"
                @click="chosenColor = color; chooseId()">
                  {{color}} · 
                </span>
              </div>
            </div>
            <!-- Size -->
            <div class="product__main--option product__main--color">
              <h6 class="product__main--option--title">Size</h6>
              <div class="product__main--option-picker">
                <span v-for="(size, index) in cleanOptions.size.values"
                :class="size === chosenSize ? 'chosen' : ''"
                @click="chosenSize = size; chooseId()">
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
          <li v-for="(d, index) in product.tabs.desc">{{d}}</li>
        </ul>
      </div>
      <div class="product__text product__text--fit">
        <h4 @click="fitOpen = !fitOpen">Fit & Sizing</h4>
        <ul v-if="fitOpen">
          <li v-for="(fs, index) in product.tabs.fitSize">{{fs}}</li>
        </ul>
      </div>
      <div class="product__text product__text--mat">
        <h4 @click="careOpen = !careOpen">Material & Care</h4>
        <ul v-if="careOpen">
          <li v-for="(mc, index) in product.tabs.materialCare">{{mc}}</li>
        </ul>
      </div>
      <div class="product__text product__text--feat">
        <h4 @click="featOpen = !featOpen">Features</h4>
        <ul v-if="featOpen">
          <li v-for="(f, index) in product.tabs.features">{{f}}</li>
        </ul>
      </div>
    </div>

    <!-- Upsells -->
    <div class="product__upsells text--left">
      <h4 class="product__upsells--title">Save with packs</h4>
        <a href="#">
          <div class="product__upsells--bundle">
            <div class="product__upsells--left">
              <img src="~/assets/svg/manifesto/manifesto_1.svg" alt="">
            </div>
            <div class="product__upsells--right">
              <div class="product__upsells--right-left">
                <h6 class="product__upsells--product-title">Starter Pack</h6>
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
        <div class="product__upsells--gender">
          <nuxt-link to="/">View all W / M packs</nuxt-link>
        </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProductSelect',
  props: {
    product: Object,
    idx: Number
  },
  data() {
    return {
      chosenColor: '...',
      chosenSize: '...',
      descOpen: false,
      fitOpen: false,
      careOpen: false,
      featOpen: false
    }
  },
  computed: {
    cleanOptions() {
      let size = this.$props.product.options.find((a) => a.name === 'Size')
      let color = this.$props.product.options.find((a) => a.name === 'Color')
      return {
        size: size,
        color: color
      }
    }
  },
  methods: {
    chooseId() {
      let chosenVariant = this.$props.product.variants.edges.find((a) => {
        let colorOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Color'
        })
        let sizeOpt = a.node.selectedOptions.find((b) => {
          return b.name === 'Size'
        })
        return this.chosenColor === colorOpt.value && this.chosenSize === sizeOpt.value
      })
      if(chosenVariant) {
        this.chosenId = chosenVariant.node.id
      }
      this.$emit('optClicked', {
        prodId: this.$props.product.id,
        id: this.chosenId,
        color: this.chosenColor,
        size: this.chosenSize,
        idx: this.$props.idx
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
