<template>
  <main :class="'container container-carbon--' + carbonIntensity.index + ' ' + $route.name" ref="container">
    <button class="read-more" @click="isOverlayOpen = true" v-if="!$route.path.includes('offline')">Read more</button>
    <Navigation @openCart="isCartOpen = true" @openSidebar="isSidebarOpen = true" v-if="!$route.path.includes('offline')" />
    <nuxt />
    <sidebar :open="isSidebarOpen" @closed="isSidebarOpen = false" v-if="!$route.path.includes('offline')"/>
    <cartDrawer :open="isCartOpen" @closed="isCartOpen = false" v-if="!$route.path.includes('offline')"/>
    <overlay :open="isOverlayOpen" :carbonIntensity="carbonIntensity" :footerData="{currentBytes, currentPage}" @closed="isOverlayOpen = false" v-if="!$route.path.includes('offline')"/>
    <Footer :currentBytes="currentBytes" :currentSavings="currentSavings" v-if="!$route.path.includes('offline')"/>
    <CookieBar/>
  </main>
</template>

<script>
import Vue from 'vue'

import Overlay from '~/components/Overlay.vue'
import Sidebar from '~/components/Sidebar.vue'
import CartDrawer from '~/components/CartDrawer.vue'
import Footer from '~/components/Footer.vue'
import CookieBar from '~/components/CookieBar.vue'
import Navigation from '~/components/Navigation.vue'

import * as CO2 from '~/node_modules/@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  name: 'default',
  components: {
    Navigation,
    Overlay,
    Sidebar,
    CartDrawer,
    Footer,
    CookieBar
  },
  async beforeMount() {
    let dispatch = await this.$store.dispatch('initStore')
  },
  async mounted() {
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
      isSidebarOpen: false,
      pageMap: {
        lowImpact: [
          {
            key: 'locale',
            name: 'front page',
            normalSize: 838739
          },
          {
            key: 'locale-collections-handle-style',
            name: 'collection page',
            normalSize: 1797668
          },
          {
            key: 'locale-products-handle',
            name: 'product page',
            normalSize: 708284
          }
        ],
        conventional: [
          {
            key: 'locale',
            name: 'front page',
            normalSize: 6338485
          },
          {
            key: 'locale-collections-handle-style',
            name: 'collection page',
            normalSize: 5282659
          },
          {
            key: 'locale-products-handle',
            name: 'product page',
            normalSize: 6550422
          }
        ]
      },
      currentBytes: 0,
      currentSavings: 0
    }
  },
  watch: {
    '$route': {
      handler: function(val) {
        
        setTimeout(this.saveEntries, 500)
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

      if(entries.length > 0) {
        this.currentBytes = entries.reduce((acc, cur) => {
          if(typeof acc !== 'number') {
            acc = cur.transferSize
          }
          else {
            acc += cur.transferSize
          }
          return acc
        })
        console.log('currentBytes: ' + this.currentBytes)
      }
      else {
        this.currentBytes = 0
      }

      let impactPage = this.pageMap.lowImpact.find((a) => {
        return this.$route.name === a.key
      })
      let conventionalPage = this.pageMap.conventional.find((a) => {
        return this.$route.name === a.key
      })
      console.log(impactPage)
      console.log(conventionalPage)
      console.log('transferredObjects: ' + this.transferredObjects.length)
    }
  },
  computed: {
    totalBytes: function() {
      if(this.transferredObjects.length > 0) {
        return this.transferredObjects.reduce((acc, cur) => {
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
    totalCarbon: function() {
      let estimatedCO2 = emissions.perByte(this.totalBytes, true)
      return estimatedCO2
    },
    carbonIntensity: function() {
      if(!this.$store.state.carbonIntensity.intensity) {
        return {
          index: '...',
          forecast: 0
        }
      }
      else {
        return {
          index: this.$store.state.carbonIntensity.intensity.index.replace(' ', '-'),
          forecast: this.$store.state.carbonIntensity.intensity.forecast
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";
@import "~assets/scss/typography.scss";
@import "~assets/scss/main.scss";
@import "~assets/scss/z-index.scss";


html {
  background: map-get($colors, "bgGrey");
  word-spacing: 1px;
  font-weight: normal;
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
  margin: 0;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-top: 90px;

  // @include screenSizes(tabletPortrait) {
  //   margin: 0 auto 20px;
  // }

  // Animations are only allowed on very low carbon intensity
  &.container-carbon--low *, &.container-carbon--moderate *, &.container-carbon--high * {
    animation: none !important;
    transition: none !important;
  }

  // Styling for specific pages
  &.locale {
    background: map-get($colors, 'bgGrey');
  }

  &.locale-collections-handle-style {
    background: #fff;
  }

  &.locale-products-handle {
    background: #fff;
  }
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

</style>
