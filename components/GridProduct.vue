<template>
  <div class="product" v-if="productData.onlineStoreUrl || $route.params.locale === 'dev'">
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
          complete: productData.completeBundle
        }"
        v-else
      >
        <div
          :class="{
            product__illustration: true,
            quantityBundle: productData.quantity
              ? true
              : productData.completeBundle,
            five: productData.quantity == 5 ? true : false,
            quantityBundle:
              productData.quantity == 2
                ? false
                : productData.quantity
                ? true
                : productData.completeBundle
          }"
          v-for="illu in productData.bundleIllustrations"
          v-html="illu"
        ></div>
        <!-- <span
          class="product__image-quant variant--black"
          v-if="productData.quantity"
        >
          <span class="product__bundle--quant">
            x{{ productData.quantity }}
          </span>
        </span> -->
      </div>
      <div class="product__slate">
        <p>{{ productData.title }}</p>
        <div class="product__price">
          <p>
            {{ parseInt(productData.variants.edges[0].node.priceV2.amount) }}
            {{ productData.variants.edges[0].node.priceV2.currencyCode }}
          </p>
          <p
            class="product__compare-price"
            v-if="
              productData.variants.edges[0].node.compareAtPrice !== null &&
                productData.variants.edges[0].node.compareAtPrice !== '0.00'
            "
          >
            {{ parseInt(productData.variants.edges[0].node.compareAtPrice) }}
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
  padding-bottom: 30px;
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
      color: map-get($colors, 'darkGrey');
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

.product__illustration {
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  background: map-get($colors, "productGrey");
  align-items: center;
  height: 180px;
  position: relative;

  @include screenSizes(tabletPortrait) {
    height: 150px;
  }

  svg {
    *[stroke*="#"] {
      stroke: map-get($colors, "black") !important;
    }

    *[fill*="#"] {
      fill: map-get($colors, "productGrey") !important;
    }

    *[fill*="grey"] {
      fill: map-get($colors, "productGrey") !important;
    }

    // Tennis Socks fix
    *[fill*="#999"] {
      fill: map-get($colors, "black") !important;
    }

    // quickfix: hide shadows on prod grid
    g[opacity="0.15"] {
      display: none !important;
      opacity: 0 !important;
    }
  }
}

.bundle__illustrations {
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: hidden;
  background: map-get($colors, "productGrey");
  align-items: center;
  height: 180px;
  position: relative;

  @include screenSizes(tabletPortrait) {
    height: 150px;
  }

  .product__illustration {
    background: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 50%;
    min-width: 80px;
    flex-grow: 1;
    position: relative;

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

  &.complete {
    flex-direction: row;
    .product__illustration {
      max-width: 50%;
      min-width: 50%;
    }
  }
}
</style>
