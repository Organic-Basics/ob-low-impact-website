<template>
  <main class="container">
    <logo />
    <h2 class="subtitle">
      Low Impact Website
    </h2>
    <div class="product-grid">
      <product v-for="(product, index) in products" :key="index" :productData="product.node" />
    </div>
  </main>
</template>

<script lang="ts">
import axios from 'axios'
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import Product from '~/components/Product.vue'

export default Vue.extend({
  components: {
    Logo,
    Product
  },
  async asyncData({ params }) {
    let response = await axios({
      method: 'post',
      url: process.env.VUE_APP_GRAPHQL_URI,
      data: {
        query: `query {
          products(first:10) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                handle,
                title,
                images(first: 1) {
                  edges {
                    node {
                      transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER)
                    }
                  }
                }
              }
            }
          }
        }`
      },
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_GRAPHQL_SECRET
      }
    })
    let products = response.data.data.products.edges
    return { products : response.data.data.products.edges }
  }
})
</script>

<style lang="scss">

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Circular', sans-serif;
  display: block;
  font-weight: bold;
  font-size: 100px;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: normal;
  font-size: 42px;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 75vw;
}

</style>
