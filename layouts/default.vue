<template>
  <main class="container">
    <nuxt-link to="/" class="logo--default">
      <logo />
    </nuxt-link>
    <button class="read-more" @click="isOverlayActive = true">Read more</button>
    <header class="header">
      <div class="stats">
        <span>kB · {{ (totalBytes / 1024).toFixed(0) }}</span>
        <span> | </span>
        <span>g CO2e · {{ totalCarbon.toFixed(2) }}</span>
      </div>
      <!-- <button @click="saveEntries()">Update</button> -->
      <span>Cart: {{ cartCount }}</span>
      <span> / </span>
      <span class="header__checkout"><a :href="cleanCheckout">Checkout</a></span>
      <div :class="'header__carbon header__carbon--' + carbonIndex">Carbon intensity is currently {{carbonIndex}} in London</div>
    </header>
    <nuxt />
    <overlay :active="isOverlayActive" @filterClosed="isOverlayActive = false"/>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import Logo from '~/components/Logo.vue'
import Overlay from '~/components/Overlay.vue'

import * as CO2 from '@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  name: 'default',
  components: {
    Logo,
    Overlay
  },
  async mounted() {
    await this.$store.dispatch('initStore')
    this.saveEntries()
  },
  updated() {
    this.saveEntries()
  },
  data: () => {
    return {
      transferredObjects: [],
      isOverlayActive: false
    }
  },
  watch: {
    '$route': {
      handler: function(val) {
        this.saveEntries()
      },
      deep: true
    },
  },
  methods: {
    saveEntries: function() {
      let entries = performance.getEntriesByType('resource')
      for(let ent of entries) {
        let entJson = ent.toJSON()
        let newEntry = {
          name: entJson.name,
          byteSize: entJson.transferSize
        }
        if(!this.transferredObjects.some((a) => {
          return a.name === newEntry.name
        })) {
          this.transferredObjects.push(newEntry)
        }
      }
      console.log('transferredObjects updated.')
    }
  },
  computed: {
    cartCount: function() {
      if(!this.$store.state.cart.lineItems || !this.$store.state.cart.lineItems.edges.length) {
        return 0
      }
      else {
        let cartCount = 0
        this.$store.state.cart.lineItems.edges.forEach((a:any) => {
          cartCount += a.node.quantity
        })
        return cartCount
      }
    },
    cleanCheckout: function() {
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
        if(theUrl !== undefined) {
          return this.$store.state.cart.webUrl.replace(theUrl.oldUrl, theUrl.newUrl)
        }
        else {
          return this.$store.state.cart.webUrl
        }
      }
    },
    carbonIndex: function() {
      if(!this.$store.state.carbonIntensity.intensity) {
        return '...'
      }
      else {
        return this.$store.state.carbonIntensity.intensity.index
      }
    },
    totalBytes: function() {
      if(this.transferredObjects.length > 0) {
        return this.transferredObjects.reduce((acc:any, cur:any) => {
          if(typeof acc !== 'number') {
            acc = cur.byteSize
          }
          else {
            acc += cur.byteSize
          }
          return acc
        })
      }
      else {
        return 0
      }
    },
    totalCarbon() {
      let estimatedCO2 = emissions.perByte(this.totalBytes, true)
      return estimatedCO2
    }
  },
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

@font-face {
  font-family: 'Circular';
  font-weight: bold;
  src: url('~assets/fonts/CircularAirPro-Bold-Small.woff2') format('woff2'),
       url('~assets/fonts/CircularAirPro-Bold-Small.woff') format('woff2');
}
@font-face {
  font-family: 'Circular';
  font-weight: normal;
  src: url('~assets/fonts/CircularAirPro-Book-Small.woff2') format('woff2'),
       url('~assets/fonts/CircularAirPro-Book-Small.woff') format('woff2');
}

html {
  background: map-get($colors, "black");
  color: #fff;
  font-family: 'Circular', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: #fff;
}

.container {
  margin: 20px auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

.logo--default {
  margin: 20px 0;
}

.header {
  margin-bottom: 10px;
}

.header__carbon {
  &.header__carbon--low {
    color: seagreen;
  }
  &.header__carbon--moderate {
    color: gold;
  }
  &.header__carbon--high {
    color: tomato;
  }
}

.read-more {
  border: 0;
  border-radius: 100%;
  cursor: pointer;
  left: 10vw;
  min-height: 50px;
  position: fixed;
  top: 20vh;
  max-width: 50px;
}

.stats {
  background: map-get($colors, 'brand');
  left: 0;
  padding: 5px 0;
  position: fixed;
  top: 0;
  width: 100vw;
}

</style>
