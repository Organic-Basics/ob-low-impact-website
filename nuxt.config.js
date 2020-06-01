let WebImpactPlugin
if(process.env.NODE_ENV === 'development') {
  WebImpactPlugin = require('./plugins/web_impact_entry');
}
require('dotenv').config()

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '🔅 Low Impact Website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#285246' },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/ga.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/svg'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Apollo module configuration
  ** See https://github.com/nuxt-community/apollo-module
  */
  apollo: {
    clientConfigs: {
      eur: {
        httpEndpoint: process.env.VUE_APP_GRAPHQL_URI_EU,
        httpLinkOptions: {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_GRAPHQL_SECRET_EU
          }
        }
      },
      dkk: {
        httpEndpoint: process.env.VUE_APP_GRAPHQL_URI_DK,
        httpLinkOptions: {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_GRAPHQL_SECRET_DK
          }
        }
      },
      gbp: {
        httpEndpoint: process.env.VUE_APP_GRAPHQL_URI_UK,
        httpLinkOptions: {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_GRAPHQL_SECRET_UK
          }
        }
      },
      usd: {
        httpEndpoint: process.env.VUE_APP_GRAPHQL_URI_US,
        httpLinkOptions: {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.VUE_APP_GRAPHQL_SECRET_US
          }
        }
      }
    }
  },
  pwa: {},
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      if(process.env.NODE_ENV === 'development' && ctx.isClient) {
        config.plugins.push(new WebImpactPlugin(false))
        config.node = {
          fs: 'empty'
        }
      }
    }
  }
}
