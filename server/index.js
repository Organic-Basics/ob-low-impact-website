const { Nuxt, Builder } = require('nuxt')
const fastify = require('fastify')({
  logger: false,
  trustProxy: true
})

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

let isAllowed = true

async function start () {
  // Uncomment the following lines to take the site truly offline.
  /*fastify.addHook('onRequest', (request, reply, done) => {
    if(request.ip !== process.env.COMPANY_IP && request.ip !== process.env.JEPSTER_IP && request.ip !== process.env.RUP_IP && !config.dev) {
      isAllowed = false
      reply.send('The Organic Basics Low Impact Website is not available right now.\nTry our normal website at www.organicbasics.com ')
    }
    else {
      done()
    }
  })*/

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  fastify.use(nuxt.render)

  fastify.listen(port, host, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

start()
