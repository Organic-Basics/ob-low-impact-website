let impacter = require('./web_impact.js')

class WebImpactPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Web Impact Plugin', (stats) => {
      this.calculate(this.isVerbose)
    })
  }

  constructor(isVerbose) {
    this.isVerbose = isVerbose !== undefined ? isVerbose : false
    this.init()
  }

  async init() {
    await impacter.init()

    process.on('exit', async (a) => {
      await impacter.exit()
    })
  }

  async calculate(isVerbose) {
    let pages = [
      {
        url: 'http://localhost:3000',
        isGreen: true
      }
    ]
    let urlPromiseQueue = []
    for(let p of pages) {
      urlPromiseQueue.push(impacter.testURL(p.url, p.isGreen))
    }
    let result = await Promise.allSettled(urlPromiseQueue)
    if(!isVerbose) {
      let output = []
      result.forEach((a) => {
        if(a.status === 'fulfilled') {
          output.push(a.value.url + ' · ' + a.value.emissionsPerView.toFixed(3) + 'CO2e per view')
        }
      })
      console.log(output)
    }
    else {
      console.log(result)
    }
  }
}

module.exports = WebImpactPlugin