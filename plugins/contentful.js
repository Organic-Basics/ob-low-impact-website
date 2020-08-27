const contentful = require('contentful')
// use default environment config for convenience
// these will be set via `env` property in nuxt.config.js
let config = {
  space: process.env.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN
}
if(process.env.NODE_ENV === 'development') config.host = 'preview.contentful.com'

// export `createClient` to use it in page components
module.exports = {
  createClient () {
    return contentful.createClient(config)
  }
}
