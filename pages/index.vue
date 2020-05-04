<template>
  <main class="container">
    <logo />
    <h2 class="subtitle">
      Low Impact Website
    </h2>
    <button @click="fetchCart()">Fetch Cart</button>
    <div class="product-grid">
      <product v-for="(product, index) in products" :key="index" :productData="product.node" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import Product from '~/components/Product.vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

export default Vue.extend({
  components: {
    Logo,
    Product
  },
  async asyncData(context:any) {
    try {
      let client = context.app.apolloProvider.defaultClient
      let result = await client.query({
        query: gql`
          query {
            products(first:24) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
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
        `
      })
      let products = result.data.products.edges.map((a:any, i:number, arr:any) => {
        if(a.node.variants !== undefined) {
          a.node.variant = a.node.variants.edges[0]
          delete a.node.variants
        }
        return a
      })
      return { products : result.data.products.edges }
    } catch(err) {
      console.error(err)
      return { products : [] }
    }
  },
  async mounted () {
    if(!this.$store.state.checkoutId) {
      let result = await this.$apollo.mutate({
        mutation: gql`
          mutation {
            checkoutCreate(input: {}) {
              userErrors {
                message
                field
              }
              checkout {
                id
              }
            }
          }
        `
      })

      try {
        console.log('Fresh Checkout ID: ' + result.data.checkoutCreate.checkout.id)
        if(result.data.checkoutCreate.checkout.id) {
          this.$store.commit('setCheckoutId', result.data.checkoutCreate.checkout.id)
        }
      } catch(err) {
        console.error(err)
      }

    }
    else {
      console.log('Stored Checkout ID: ' + this.$store.state.checkoutId)
    }
  },
  methods: {
    async fetchCart () {
      this.$store.dispatch('fetchCart')
    }
  }
})
</script>

<style lang="scss">

.container {
  margin: 20px auto;
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
