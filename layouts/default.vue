<template>
  <main ref="container" :class="'container container-carbon--' + carbonIntensity.index + ' ' + $route.name">
    <button v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')" class="read-more" @click="openOverlay">
      <img src="~/assets/svg/read-more.svg" alt="Read more">
      <img src="~/assets/svg/read-more-middle.svg" alt="Read more">
    </button>
    <Navigation v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')" :main-site-link="mainSiteLink" @openCart="openCart" @openSidebar="openSidebar" />
    <nuxt />
    <sidebar v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')" :open="isSidebarOpen" @closed="isSidebarOpen = false" />
    <div v-if="isCartOpen" class="cart__click-overlay" @click="isCartOpen = false" />
    <cartDrawer v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')" :open="isCartOpen" @closed="isCartOpen = false" />
    <overlay
      v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')"
      :open="isOverlayOpen"
      :carbon-intensity="carbonIntensity"
      :main-site-link="mainSiteLink"
      :footer-data="{currentBytes, currentSavingsMultiplier, currentPage, totalSavings}"
      @closed="isOverlayOpen = false"
    />
    <Footer v-if="!$route.path.includes('offline') && !$route.path.includes('unavailable')" :current-bytes="currentBytes" :current-savings-multiplier="currentSavingsMultiplier" :current-page="currentPage" :total-savings="totalSavings" />
    <CookieBar />
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
import mainSiteMap from '~/assets/json/mainSiteMap.json'

import * as CO2 from '~/node_modules/@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  name: 'Default',
  components: {
    Navigation,
    Overlay,
    Sidebar,
    CartDrawer,
    Footer,
    CookieBar
  },
  data: () => {
    return {
      transferredObjects: [],
      isOverlayOpen: false,
      isCartOpen: false,
      isSidebarOpen: false,
      mainSiteMap,
      pageMap: [
        {
          key: 'locale',
          name: 'front page',
          lowImpactSize: 838739,
          normalSize: 6338485
        },
        {
          key: 'locale-collections-handle-style',
          name: 'collection page',
          lowImpactSize: 1797668,
          normalSize: 5282659
        },
        {
          key: 'locale-products-handle',
          name: 'product page',
          lowImpactSize: 708284,
          normalSize: 6550422
        },
        {
          key: 'offline',
          name: 'offline page',
          lowImpactSize: 0,
          normalSize: 0
        },
        {
          key: 'unavailable',
          name: 'unavailable page',
          lowImpactSize: 0,
          normalSize: 0
        },
        {
          key: 'index',
          name: 'index page',
          lowImpactSize: 0,
          normalSize: 0
        }
      ],
      currentBytes: 0,
      currentSavingsMultiplier: 0,
      currentPage: {
        key: '',
        name: '',
        lowImpactSize: 0,
        normalSize: 0
      },
      totalSavings: 0,
      visitedPages: []
    }
  },
  computed: {
    totalBytes () {
      if (this.transferredObjects.length > 0) {
        return this.transferredObjects.reduce((acc, cur) => {
          if (typeof acc !== 'number') {
            acc = cur.byteSize
          } else {
            acc += cur.byteSize
          }
          return acc
        })
      } else {
        return 0
      }
    },
    totalCarbon () {
      const estimatedCO2 = emissions.perByte(this.totalBytes, true)
      return estimatedCO2
    },
    carbonIntensity () {
      if (!this.$store.state.carbonIntensity.intensity) {
        return {
          index: '...',
          forecast: 0
        }
      } else {
        return {
          index: this.$store.state.carbonIntensity.intensity.index.replace(' ', '-'),
          forecast: this.$store.state.carbonIntensity.intensity.forecast
        }
      }
    },
    mainSiteLink () {
      const mainSiteData = this.mainSiteMap.mainSiteMap
      const mainSite = mainSiteData.find((a) => {
        return a.currency == this.$store.state.activeCurrency
      })
      if (mainSite) {
        const mainSiteUrl = 'https://' + mainSite.url + this.$route.path.replace('/' + this.$store.state.activeCurrency, '')
        return mainSiteUrl
      } else {

      }
    }
  },
  watch: {
    $route: {
      handler (val) {
        setTimeout(() => { this.saveEntries(true) }, 500)
      },
      deep: true
    }
  },
  async beforeMount () {
    const dispatch = await this.$store.dispatch('initStore')
  },
  async mounted () {
    this.saveEntries(true)
  },
  updated () {
    this.saveEntries()
  },
  methods: {
    openCart () {
      this.isCartOpen = true
      this.isOverlayOpen = false
      this.isSidebarOpen = false
    },
    openSidebar () {
      this.isCartOpen = false
      this.isOverlayOpen = false
      this.isSidebarOpen = true
    },
    openOverlay () {
      this.isCartOpen = false
      this.isOverlayOpen = true
      this.isSidebarOpen = false
      ga('send', 'event', 'LIW: Opened "Learn More" overlay', 'Click', 'Clicked on Learn More button')
    },
    saveEntries (isRouteChange) {
      const entries = performance.getEntriesByType('resource')
      for (const ent of entries) {
        const entJson = ent.toJSON()
        const newEntry = {
          name: entJson.name,
          byteSize: entJson.transferSize
        }
        if (!this.transferredObjects.some((a) => {
          return a.name === newEntry.name
        })) {
          this.transferredObjects.push(newEntry)
        }
      }

      this.currentPage = this.pageMap.find((a) => {
        return this.$route.name === a.key
      })
      this.currentBytes = this.currentPage.lowImpactSize
      this.currentSavingsMultiplier = 1 / (this.currentPage.lowImpactSize / this.currentPage.normalSize)

      if (isRouteChange) {
        this.visitedPages.push(this.currentPage)
      }

      let usedBytes = 0
      if (this.visitedPages.length > 0) {
        if (entries.length > 0) {
          usedBytes = entries.reduce((acc, cur) => {
            if (typeof acc !== 'number') {
              acc = cur.transferSize
            } else {
              acc += cur.transferSize
            }
            return acc
          }, 0)
        }

        // Fix for Safari, which doesn't have transferSize
        if (Number.isNaN(usedBytes)) {
          usedBytes = this.visitedPages.reduce((acc, cur) => {
            if (typeof acc !== 'number') {
              acc = cur.lowImpactSize
            } else {
              acc += cur.lowImpactSize
            }
            return acc
          }, 0)
        }

        let conventionalBytes = 0
        conventionalBytes = this.visitedPages.reduce((acc, cur) => {
          if (typeof acc !== 'number') {
            acc = cur.normalSize
          } else {
            acc += cur.normalSize
          }
          return acc
        }, 0)

        this.totalSavings = emissions.perByte(Math.abs(conventionalBytes - usedBytes), true)
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

  @include screenSizes(phoneSmall) {
    padding: 40px 20px;
  }
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
  min-height: 50px;
  position: fixed;
  top: 20vh;
  background: none;
  left: 15vw;
  display: flex;
  align-items: center;
  justify-content: center;

  @include screenSizes(tabletPortrait) {
    left: 10vw;
    top: 15vh;
  }

  @include screenSizes(phone) {
    left: 20px;
    padding: 0;
  }

  img:first-child {
    width: 75px;
    animation-name: buttonRotate;
    animation-duration: 40s;
    animation-iteration-count: infinite;

    @include screenSizes(phone) {
      width: 70px;
    }
  }

  img:nth-child(2) {
    position: absolute;
    height: 28px;

    @include screenSizes(phone) {
      height: 25px;
    }
  }
}

@keyframes buttonRotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.cart__click-overlay {
  background: rgba(0, 0, 0, 0.25);
  height: 100vh;
  left: 0;
  position: fixed;
  width: 100vw;
  top: 0;
}

</style>
