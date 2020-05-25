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
  fastify.addHook('onRequest', (request, reply, done) => {
    if(request.ip !== process.env.COMPANY_IP && request.ip !== process.env.JEPSTER_IP && !config.dev) {
      isAllowed = false
      reply.send('Not allowed.')
    }
    else {
      done()
    }
  })

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
