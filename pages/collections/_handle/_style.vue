<template>
  <div>
    <h5 class="collection__heading">{{ collectionTitle }}</h5>
    <div class="product-grid">
      <gridProduct v-for="(product, index) in products" :key="index" :productData="product.node" />
    </div>
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
  head() {
    // WIP: set meta tags for this page
  },
  async asyncData({app, params}) {
    try {
      if(app && app.apolloProvider && app.apolloProvider.defaultClient) {
        let client = app.apolloProvider.defaultClient
        let result

        let productsQuery = `edges {
          node {
            handle,
            title,
            id,
            options {
              name,
              values
            },
            variants(first:50) {
              edges {
                node {
                  price,
                  compareAtPrice
                }
              }
            },
            images(first: 1) {
              edges {
                node {
                  transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER)
                }
              }
            }
          }
        }`

        let title = ''
        if(params.style) {
          let gender = params.handle.match(/[wo]*mens/g)
          let style = params.style.replace(/style-/, '')
          title = style.charAt(0).toUpperCase() + style.slice(1)
          let styleQuery = `${gender}, ${style}`
          result = await client.query({
            // Apollo GraphQL query: fetch data
            query: gql`
              query {
                products(first: 100, query: "${styleQuery}") {
                  ${productsQuery}
                }
              }
            `
          })
        }
        else {
          result = await client.query({
            // Apollo GraphQL query: fetch data
            query: gql`
              query {
                collectionByHandle(handle: "${params.handle}") {
                  title,
                  products(first: 100) {
                    ${productsQuery}
                  }
                }
              }
            `
          })
          title = result.data.collectionByHandle.title
        }

        // let variantPrice = result.data.collectionByHandle.products.edges.node.variants.edges.node.price

        // create new array that only contains the Color product options
        let productsData = result.data.collectionByHandle == true ? result.data.collectionByHandle.products.edges : result.data.products.edges
        let products = []
        for(let i = 0; i < productsData.length; i++) {
          let a = productsData[i]
          if(a.node.options) {
            // find the Color product option
            let colorOpt = a.node.options.find(b => b.name === 'Color')
            if(colorOpt) a.node.colorValues = colorOpt.values
            else a.node.colorValues = []

          }
          else {
            a.node.colorValues = []
          }

          let productIllustration = ''
          try {
            let illuHandle = a.node.handle
            if(illuHandle.includes('accessories') || illuHandle.includes('socks')) {
              illuHandle = illuHandle.replace(/womens-/g, '').replace(/mens-/g, '')
            }
            let productSvg = await import('~/assets/svg/products/' + illuHandle + '.svg?raw')
            if(productSvg.default) a.node.productIllustration = productSvg.default
          } catch(err) {
            a.node.productIllustration = ''
          }

          products.push(a)
        }
        return {
          // nuxt el : query var
          products : products,
          collectionTitle : title
        }
      }
      else {
        return { products : [], collectionTitle : '' }
      }
    } catch(err) {
      console.error(err)
      return { products : [], collectionTitle : '' }
    }

  }
})

</script>

<style lang="scss">

html {
  background: white;
}

.collection__heading {
  margin: 40px auto 20px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 90vw;
}

</style>
