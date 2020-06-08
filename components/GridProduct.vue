<template>
  <div class="product" v-if="productData.onlineStoreUrl">
    <nuxt-link
      :to="
        '/' + $store.state.activeCurrency + '/products/' + productData.handle
      "
    >
      <div
        class="product__illustration"
        v-if="productData.isSingleProduct"
        v-html="productData.productIllustration"
      ></div>
      <div
        :class="{
          bundle__illustrations: true,
          triple: productData.tripleBundle
        }"
        v-else
      >
        <div
          class="product__illustration"
          v-for="illu in productData.bundleIllustrations"
          v-html="illu"
        ></div>
        <span
          class="product__image-quant variant--black"
          v-if="productData.quantity"
        >
          <span class="product__bundle--quant">
            x{{ productData.quantity }}
          </span>
        </span>
      </div>
      <div class="product__slate">
        <p>{{ productData.title }}</p>
        <div class="product__price">
          <p>
            {{ productData.variants.edges[0].node.priceV2.amount }}
            {{ productData.variants.edges[0].node.priceV2.currencyCode }}
          </p>
          <p
            class="product__compare-price"
            v-if="
              productData.variants.edges[0].node.compareAtPrice !== null &&
                productData.variants.edges[0].node.compareAtPrice !== '0.00'
            "
          >
            {{ productData.variants.edges[0].node.compareAtPrice }}
            {{ productData.variants.edges[0].node.priceV2.currencyCode }}
          </p>
        </div>
        <div class="variant__container">
          <span
            v-for="color in productData.colorValues"
            :class="
              'variant__selector variant--' +
                [
                  color
                    .toLowerCase()
                    .split(' ')
                    .join('')
                ]
            "
          >
          </span>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "GridProduct",
  props: {
    productData: Object
  }
});
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.product {
  border-bottom: 1px solid #fff;
  display: flex;
  flex-direction: column;
  margin: 0 10px 15px 0;
  padding-bottom: 15px;
  width: 23%;

  @include screenSizes(tabletPortrait) {
    width: 30%;
  }

  @include screenSizes(phone) {
    // width: 50%;
    flex-basis: calc(50% - 20px);
  }

  img {
    width: 100%;
  }
}

.product__slate {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;

  p {
    text-decoration: none;
    margin-bottom: 5px;
    text-align: left;
  }

  .product__price {
    display: flex;
    flex-direction: row;

    .product__compare-price {
      margin-left: 8px;
      text-decoration: line-through;
    }
  }

  .variant__container {
    display: flex;
    flex-direction: row;

    .variant__selector {
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }
  }
}

.bundle__illustrations {
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: map-get($colors, "productGrey");
  align-items: center;
  height: 180px;
  position: relative;

  .product__illustration {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: map-get($colors, "productGrey");
    max-width: 50%;
    min-width: 80px;
    flex-grow: 1;

    svg {
      *[stroke*="#"] {
        stroke: map-get($colors, "black") !important;
      }

      *[fill*="#"] {
        fill: map-get($colors, "productGrey") !important;
      }
    }
  }
  .product__image-quant {
    bottom: 25%;
    right: 20%;
    position: absolute;
    border: 1.5px solid map-get($colors, "black");
    border-radius: 50%;
    height: 26.5px;
    width: 26.5px;
    font-size: 17px;
    .product__bundle--quant {
      font-size: 0.8rem;
      color: white;
    }
  }

  &.triple {
    flex-direction: row;
    .product__illustration {
      max-width: 50%;
      min-width: 50%;
    }
  }
}
</style>
