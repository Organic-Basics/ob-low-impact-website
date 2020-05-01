<template>
  <div class="product">
    <img :src="productData.images.edges[0].node.transformedSrc">
    <p>{{ productData.title }}</p>
  </div>
</template>

<script>
export default {
  name: 'Product',
  props: {
    productData: Object
  }
}
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.product {
  flex: 33%;
  margin: 0 10px 15px 0;
  max-width: 300px;
}

</style>
