<template>
  <div class="product-grid">
    <product v-for="(product, index) in products" :key="index" :productData="product.node" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Product from '~/components/Product.vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

export default Vue.extend({
  components: {
    Product
  },
  async asyncData(context:any) {
    try {
      let client = context.app.apolloProvider.defaultClient
      let result = await client.query({
        query: gql`
          query {
            collections(query: "${context.route.params.handle}", first:1) {
              edges {
                node {
                  products(first: 24) {
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
            }
          }
        `
      })
      console.log(result)
      let products = result.data.collections.edges[0].node.products.edges.map((a:any, i:number, arr:any) => {
        if(a.node.variants !== undefined) {
          a.node.variant = a.node.variants.edges[0]
          delete a.node.variants
        }
        return a
      })
      return { products : result.data.collections.edges[0].node.products.edges }
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
  max-width: 75vw;
}

</style>
