const contentful = require('contentful')
// use default environment config for convenience
// these will be set via `env` property in nuxt.config.js
const config = {
  space: 'vdb5ucyg6sha',
  accessToken: '2_-3sAqNFMF3Xk3sXrsojF42MFSlu6WLNbQhjn4BGhY'
}

// export `createClient` to use it in page components
module.exports = {
  createClient () {
    return contentful.createClient(config)
  }
}
