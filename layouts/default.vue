<template>
  <main class="container">
    <button class="read-more" @click="isOverlayOpen = true">Read more</button>

    <div class="stats">
      <span>kB · {{ (totalBytes / 1024).toFixed(0) }}</span>
      <span> | </span>
      <span>g CO2e · {{ totalCarbon.toFixed(2) }}</span>
    </div>

    <header class="header">
      <div class="header__menu" @click="isSidebarOpen = true">
        <span>Menu</span>
      </div>
      <nuxt-link to="/" class="header__logo">
        <Logo />
      </nuxt-link>
      <!-- <button @click="saveEntries()">Update</button> -->
      <div class="header__cart" @click="isCartOpen = true">
        <span>{{ cartCount }}</span>
      </div>
    </header>
    <nuxt />
    <sidebar :open="isSidebarOpen" @closed="isSidebarOpen = false"/>
    <cartDrawer :open="isCartOpen" @closed="isCartOpen = false"/>
    <overlay :open="isOverlayOpen" @closed="isOverlayOpen = false"/>
    <Footer />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

import Logo from '~/components/Logo.vue'
import Overlay from '~/components/Overlay.vue'
import Sidebar from '~/components/Sidebar.vue'
import CartDrawer from '~/components/CartDrawer.vue'
import Footer from '~/components/Footer.vue'

import * as CO2 from '@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  name: 'default',
  components: {
    Logo,
    Overlay,
    Sidebar,
    CartDrawer,
    Footer
  },
  async mounted() {
    await this.$store.dispatch('initStore')
    console.log(this)
    this.saveEntries()
  },
  updated() {
    this.saveEntries()
  },
  data: () => {
    return {
      transferredObjects: [],
      isOverlayOpen: false,
      isCartOpen: false,
      isSidebarOpen: false
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
@import "~assets/scss/mixins.scss";
@import "~assets/scss/typography.scss";
@import "~assets/scss/main.scss";


html {
  background: map-get($colors, "bgGrey");
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

section {
  padding: map-get($mobile, "sectionPadding");
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

.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 15px 0 10px;
  padding: 0 10px;
  width: 100vw;
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
