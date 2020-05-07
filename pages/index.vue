<template>
  <main class="container">
    <logo />
    <h2 class="subtitle">
      Low Impact Website
    </h2>
    <header class="header">
      <span>Items in cart: {{ cartCount }}</span>
      <span> / </span>
      <span class="header__checkout"><a :href="cleanCheckout">Checkout</a></span>
      <div :class="'header__carbon header__carbon--' + carbonIndex">Carbon intensity is currently {{carbonIndex}} in London</div>
    </header>
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
  computed: {
    cartCount() {
      if(!this.$store.state.cart.lineItems) {
        return 0
      }
      else {
        // console.log(this.$store.state.lineItems)
        return 5
        return this.$store.state.cart.lineItems.edges.reduce((acc:any, cur:any) => {
          if(typeof acc !== 'number') {
            try {
              let count = parseInt(cur.node.quantity)
              return count
            } catch(err) {
              console.error(err)
              return acc
            }
          }
          else {
            try {
              let count = parseInt(cur.node.quantity)
              return acc + count
            } catch(err) {
              console.error(err)
              return acc
            }
          }
        })
      }
    },
    cleanCheckout() {
      let checkoutUrls = [
        {
          oldUrl: 'aoftd.myshopify.com',
          newUrl: 'dk.organicbasics.com'
        },
        {
          oldUrl: 'euorganicbasics.myshopify.com',
          newUrl: 'organicbasics.com'
        },
        {
          oldUrl: 'ukorganicbasics.myshopify.com',
          newUrl: 'uk.organicbasics.com'
        },
        {
          oldUrl: 'usorganicbasics.myshopify.com',
          newUrl: 'us.organicbasics.com'
        }
      ]
      if(!this.$store.state.cart.webUrl) {
        return '#'
      }
      else {
        let theUrl = checkoutUrls.find((url) => this.$store.state.cart.webUrl.includes(url.oldUrl))
        console.log(theUrl)
        if(theUrl !== undefined) {
          return this.$store.state.cart.webUrl.replace(theUrl.oldUrl, theUrl.newUrl)
        }
        else {
          return this.$store.state.cart.webUrl
        }
      }
    },
    carbonIndex() {
      if(!this.$store.state.carbonIntensity.intensity) {
        return '...'
      }
      else {
        return this.$store.state.carbonIntensity.intensity.index
      }
    }
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

.header {
  margin-bottom: 10px;

  a {
    color: #fff;
  }
}

.header__carbon {
  &.header__carbon--moderate {
    color: yellow;
  }
}

</style>
