var WebImpactPlugin = require('./web_impact_entry');

const impactModule = function (moduleOptions) {
  this.extendBuild((config, { isClient, isModern }) => {
    config.plugins.push(new WebImpactPlugin(false))
  })
}

export default impactModule