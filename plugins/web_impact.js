const puppeteer = require('puppeteer')
const CO2 = require('@tgwf/co2')
const co2Emission = new CO2.co2()
const hosting = CO2.hosting

let byteSize = 0
let browser

exports.init = async function(opts) {
  browser = await puppeteer.launch()

  if(opts === undefined) {
    // 
    opts = {...{
      viewport: {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2
      }
    }, ...opts}
  }
}

exports.exit = async function() {
  await browser.close()
}
 
exports.testURL = async function(url, isGreen, opts, pageViews) {
  return new Promise(async (resolve, reject) => {
    if(url === undefined) {
      reject('No URL given.')
    }
    if(!url.match(/^http/)) {
      reject(`URL ${url} doesn't start with http`)
    }

    if(pageViews === undefined) pageViews = 1

    if(opts === undefined) {
      // 
      opts = {...{
        viewport: {
          width: 1440,
          height: 900,
          deviceScaleFactor: 2
        }
      }, ...opts}
    }

    let page = await browser.newPage()

    await page.setCacheEnabled(false)
    await page.setViewport(opts.viewport)
    
    let byteSize = 0

    page.on('response', async (response) => {
      // console.log(response._request._url)
      let err
      let buff = await response.buffer().catch((e) => {
        err = e
      })
      if(err === undefined) byteSize += buff.length
    })

    await page.goto(url).catch((err) => {
      reject(err)
    })

    let urlObj = new URL(url)

    isGreen = isGreen !== undefined ? isGreen : await hosting.check(urlObj.hostname)

    let estimatedCO2 = co2Emission.perByte(byteSize, isGreen)

    page.close()
    
    resolve({
      bytes: byteSize,
      emissionsPerView: estimatedCO2,
      emissionsTotal: pageViews * estimatedCO2,
      url: url,
      isGreen: isGreen
    })
  })
}
