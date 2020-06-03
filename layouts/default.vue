<template>
  <main :class="'container container-carbon--' + carbonIntensity.index + ' ' + $route.name" ref="container">
    <button class="read-more" @click="isOverlayOpen = true" v-if="!$route.path.includes('offline')">Read more</button>

    <header class="header" v-if="!$route.path.includes('offline')" ref="header">
      <div class="header__menu" @click="isSidebarOpen = true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nuxt-link :to="'/' + $store.state.activeCurrency" class="header__logo">
        <Logo />
      </nuxt-link>
      <div class="header__cart" @click="isCartOpen = true">
        <CartIcon />
        <span class="header__cart-count">{{ cartCount }}</span>
      </div>
    </header>
    <nuxt />
    <sidebar :open="isSidebarOpen" @closed="isSidebarOpen = false" v-if="!$route.path.includes('offline')"/>
    <cartDrawer :open="isCartOpen" @closed="isCartOpen = false" v-if="!$route.path.includes('offline')"/>
    <overlay :open="isOverlayOpen" :carbonIntensity="carbonIntensity" :footerData="{currentBytes, currentPage}" @closed="isOverlayOpen = false" v-if="!$route.path.includes('offline')"/>
    <Footer :currentBytes="currentBytes" :currentPage="currentPage" v-if="!$route.path.includes('offline')"/>
    <CookieBar/>
  </main>
</template>

<script>
import Vue from 'vue'

import Logo from '~/components/Logo.vue'
import CartIcon from '~/components/CartIcon.vue'
import Overlay from '~/components/Overlay.vue'
import Sidebar from '~/components/Sidebar.vue'
import CartDrawer from '~/components/CartDrawer.vue'
import Footer from '~/components/Footer.vue'
import CookieBar from '~/components/CookieBar.vue'

import * as CO2 from '~/node_modules/@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  name: 'default',
  components: {
    Logo,
    Overlay,
    Sidebar,
    CartDrawer,
    Footer,
    CookieBar,
    CartIcon
  },
  async beforeMount() {
    let dispatch = await this.$store.dispatch('initStore')
  },
  async mounted() {
    this.currentPage = this.pageMap.find((a) => {
      return this.$route.name === a.key
    })
    this.saveEntries()
  },
  created() {
    if(process.client) {
      window.addEventListener('scroll', this.handleStickyHeader)
    }

  },
  updated() {
    this.saveEntries()
  },
  destroyed() {
    if(process.client) {
      window.removeEventListener('scroll', this.handleStickyHeader)
    }
  },
  data: () => {
    return {
      transferredObjects: [],
      isOverlayOpen: false,
      isCartOpen: false,
      isSidebarOpen: false,
      pageMap: [
        {
          key: 'index',
          name: 'front page',
          normalSize: 14240040
        },
        {
          key: 'collections-handle',
          name: 'collection page',
          normalSize: 8908927
        },
        {
          key: 'products-handle',
          name: 'product page',
          normalSize: 11323705
        }
      ],
      currentPage: {
        key: '',
        name: '',
        normalSize: 1
      },
      currentBytes: 0
    }
  },
  watch: {
    '$route': {
      handler: function(val) {
        this.currentPage = this.pageMap.find((a) => {
          return val.name === a.key
        })
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
      console.log('transferredObjects: ' + this.transferredObjects.length)
    },
    handleStickyHeader: function() {
      let header = this.$refs.header
      let headerOffset = header.offsetTop
      let headerHeight = header.offsetHeight

      if(headerOffset > headerHeight) {
        header.classList.add('header--sticky')
      } else {
        header.classList.remove('header--sticky')
      }
    }
  },
  computed: {
    cartCount: function() {
      if(!this.$store.state.cart.lineItems || !this.$store.state.cart.lineItems.edges.length) {
        return 0
      }
      else {
        let cartCount = 0
        this.$store.state.cart.lineItems.edges.forEach((a) => {
          cartCount += a.node.quantity
        })
        return cartCount
      }
    },
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
  },
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
  margin: 0 auto 20px;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;

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

.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

  .header__menu {
    cursor: pointer;
    display: block;
    height: 18px;
    position: relative;
    width: 20px;

    span {
      background: map-get($colors, 'black');
      display: block;
      height: 2px;
      left: 0;
      position: absolute;
      top: 0;
      width: 20px;

      &:first-child {
        transform: translateY(12px);
      }

      &:last-child {
        transform: translateY(6px);
      }
    }
  }

  .header__cart {
    cursor: pointer;

    .header__cart-count {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 10px;
    }
  }
}

.header--sticky {
  background: #fff;
  transition: .2s;
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
