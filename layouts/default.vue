<template>
  <main :class="'container container-carbon--' + carbonIntensity.index + ' ' + $route.name" ref="container">
    <button class="read-more" @click="isOverlayOpen = true" v-if="!$route.path.includes('offline')">
      <img src="~/assets/svg/read-more.svg" alt="Read more">
    </button>
    <Navigation @openCart="isCartOpen = true" @openSidebar="isSidebarOpen = true" v-if="!$route.path.includes('offline')" />
    <nuxt @click="isCartOpen = false"/>
    <sidebar :open="isSidebarOpen" @closed="isSidebarOpen = false" v-if="!$route.path.includes('offline')"/>
    <cartDrawer :open="isCartOpen" @closed="isCartOpen = false" v-if="!$route.path.includes('offline')"/>
    <overlay :open="isOverlayOpen" :carbonIntensity="carbonIntensity" @closed="isOverlayOpen = false" v-if="!$route.path.includes('offline')" :footerData="{currentBytes, currentSavingsMultiplier, currentPage, totalSavings}"/>
    <Footer :currentBytes="currentBytes" :currentSavingsMultiplier="currentSavingsMultiplier" :currentPage="currentPage" :totalSavings="totalSavings" v-if="!$route.path.includes('offline')"/>
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
    this.saveEntries(true)
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
  watch: {
    '$route': {
      handler: function(val) {
        setTimeout(() => { this.saveEntries(true) }, 500)
      },
      deep: true
    },
  },
  methods: {
    openCart(){
      this.isCartOpen = true;
    },
    saveEntries: function(isRouteChange) {
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

      this.currentPage = this.pageMap.find((a) => {
        return this.$route.name === a.key
      })
      this.currentBytes = this.currentPage.lowImpactSize
      this.currentSavingsMultiplier = 1 / (this.currentPage.lowImpactSize / this.currentPage.normalSize)

      let thisSaving = this.currentPage.lowImpactSize

      if(isRouteChange) {
        this.visitedPages.push(this.currentPage)
      }

      if(this.visitedPages.length > 0) {
        let usedBytes = 0
        if(entries.length > 0) {
          usedBytes = entries.reduce((acc, cur) => {
            if(typeof acc !== 'number') {
              acc = cur.transferSize
            }
            else {
              acc += cur.transferSize
            }
            return acc
          }, 0)
        }

        let conventionalBytes = 0
        conventionalBytes = this.visitedPages.reduce((acc, cur) => {
          if(typeof acc !== 'number') {
            acc = cur.normalSize
          }
          else {
            acc += cur.normalSize
          }
          return acc
        }, 0)

        this.totalSavings = emissions.perByte(Math.abs(conventionalBytes - usedBytes), true)
      }
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
  min-height: 50px;
  position: fixed;
  top: 20vh;
  background: none;
  left: 15vw;

  @include screenSizes(tabletPortrait) {
    left: 10vw;
    top: 15vh;
  }

  @include screenSizes(phone) {
    left: 20px;
    padding: 0;
  }

  img {
    width: 75px;

    @include screenSizes(phone) {
      width: 60px;
    }
  }
}

</style>
