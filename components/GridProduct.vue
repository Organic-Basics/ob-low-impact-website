<template>
  <div class="product" v-if="productData.onlineStoreUrl">
    <nuxt-link :to="'/products/' + productData.handle">
      <div class="product__illustration" v-html="productData.productIllustration"></div>
      <div class="product__slate">
        <p>{{ productData.title }}</p>
        <div class="product__price">
          <p>{{ productData.variants.edges[0].node.price }}</p>
          <p class="product__compare-price" v-if="productData.variants.edges[0].node.compareAtPrice !== '0.00'">{{ productData.variants.edges[0].node.compareAtPrice }}</p>
        </div>
        <div class="variant__container">
          <span v-for="color in productData.colorValues"
            :class="'variant__selector variant--' + [ color.toLowerCase().split(' ').join('') ]">
          </span>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'GridProduct',
  props: {
    productData: Object
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.product {
  border-bottom: 1px solid #fff;
  display: flex;
  flex-direction: column;
  flex: 33%;
  margin: 0 10px 15px 0;
  padding-bottom: 15px;
  max-width: 50%;

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

.product__illustration {
  background: map-get($colors, 'productGrey');

  svg {
    *[stroke*="#"] {
      stroke: map-get($colors, 'black') !important;
    }

    *[fill*="#"] {
      fill: map-get($colors, 'productGrey') !important;
    }
  }
}

</style>
