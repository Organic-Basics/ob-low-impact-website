<template>
  <div class="product-grid">
    <gridProduct v-for="(product, index) in products" :key="index" :productData="product.node" />
  </div>
</template>

<script>
import Vue from 'vue'
import GridProduct from '~/components/GridProduct.vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

export default Vue.extend({
  components: {
    GridProduct
  },
  async asyncData({app, params}) {
    try {
      if(app && app.apolloProvider && app.apolloProvider.defaultClient) {
        let client = app.apolloProvider.defaultClient
        let result = await client.query({
          query: gql`
            query {
              collectionByHandle(handle: "${params.handle}") {
                products(first: 100) {
                  edges {
                    node {
                      handle,
                      title,
                      id,
                      images(first: 1) {
                        edges {
                          node {
                            transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER)
                          }
                        }
                      },
                      variants(first: 1) {
                        edges {
                          node {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        })

        let products = result.data.collectionByHandle.products.edges.map((a, i, arr) => {
          if(a.node.variants !== undefined) {
            a.node.variant = a.node.variants.edges[0]
            delete a.node.variants
          }
          return a
        })
        return { products : result.data.collectionByHandle.products.edges }
      }
      else {
        return { products : [] }
      }
    } catch(err) {
      console.error(err)
      return { products : [] }
    }
  }
})
</script>

<style lang="scss">

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90vw;
}

</style>
