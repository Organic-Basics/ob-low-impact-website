<template>
  <header ref="header" class="header" :class="hoverWomens ? 'header--grey' : hoverMens ? 'header--grey' : ''">
    <!-- Mobile links -->
    <div class="menu--mobile" @click="openSidebar()">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <!-- Desktop links -->
    <div class="menu--desktop">
      <ul class="menu__links--desktop links--left">
        <li @mouseover="hoverWomens=true" @mouseleave="hoverWomens=false" @click="hoverWomens=false">
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`">Shop Women</nuxt-link>
        </li>
        <li @mouseover="hoverMens=true" @mouseleave="hoverMens=false" @click="hoverMens=false">
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`">Shop Men</nuxt-link>
        </li>
      </ul>
      <nuxt-link :to="'/' + $store.state.activeCurrency" class="header__logo">
        <Logo />
      </nuxt-link>
      <ul class="menu__links--desktop">
        <li><a :href="mainSiteLink">Normal website</a></li>
        <li><nuxt-link :to="'/' + $store.state.activeCurrency + '#manifesto'">Manifesto</nuxt-link></li>
      </ul>
    </div>
    <div class="header__icons">
      <div class="header__currency">
        <span  @click="toggleDropdown">{{$store.state.activeCurrency}}</span>
      </div>
      <div :class="{'header__currency--dropdown': true,'dropdown--open': isOpen}">
        <span @click="changeCurrency('eur')" :class="$store.state.activeCurrency === 'eur' ? 'header__currency--active' : ''">EUR</span>
        <span @click="changeCurrency('dkk')" :class="$store.state.activeCurrency === 'dkk' ? 'header__currency--active' : ''">DKK</span>
        <span @click="changeCurrency('gbp')" :class="$store.state.activeCurrency === 'gbp' ? 'header__currency--active' : ''">GBP</span>
        <span @click="changeCurrency('usd')" :class="$store.state.activeCurrency === 'usd' ? 'header__currency--active' : ''">USD</span>
      </div>
      <div class="header__cart" @click="openCart()">
        <CartIcon />
        <span class="header__cart-count">
          <span>{{ cartCount }}</span>
        </span>
      </div>
    </div>

    <!-- Desktop dropdown -->
    <div class="menu__dropdown--women" v-show="hoverWomens" @mouseover="hoverWomens=true" @mouseleave="hoverWomens=false">
        <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`"><h2>Shop Women</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in menuLinks.menuLinks.womens" v-if="index < 8" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`">
          <h3 class="menu__link">{{link.name}}</h3>
        </nuxt-link>
    </div>
    <div class="menu__dropdown--men" v-show="hoverMens" @mouseover="hoverMens=true" @mouseleave="hoverMens=false">
      <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`"><h2>Shop Men</h2></nuxt-link>
      <nuxt-link v-for="(link, index) in menuLinks.menuLinks.mens" v-if="index < 6" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`">
        <h3 class="menu__link">{{link.name}}</h3>
      </nuxt-link>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'

import Logo from '~/components/Logo.vue'
import CartIcon from '~/components/CartIcon.vue'
import menuLinks from '~/assets/json/menuLinks.json'
import mainSiteMap from '~/assets/json/mainSiteMap.json'

export default Vue.extend({
  name: 'Navigation',
  components: {
    Logo,
    CartIcon
  },
  props: {
    womenLinks: Array,
    menLinks: Array
  },
  data: () => {
    return {
      hoverWomens: false,
      hoverMens: false,
      menuLinks: menuLinks,
      mainSiteMap: mainSiteMap,
      isOpen: false
    }
  },
  created() {
    if(process.client) {
      window.addEventListener('scroll', this.handleStickyHeader)
    }
  },
  destroyed() {
    if(process.client) {
      window.removeEventListener('scroll', this.handleStickyHeader)
    }
  },
  methods: {
    openCart: function () {
      this.$emit('openCart')
      this.isOpen = false
    },
    openSidebar: function() {
      this.$emit('openSidebar')
    },
    handleStickyHeader: function() {
      let header = this.$refs.header
      let pageOffset = window.pageYOffset
      let headerHeight = header.offsetHeight

      if(pageOffset > headerHeight) {
        header.classList.add('header--sticky')
      } else {
        header.classList.remove('header--sticky')
      }
    },
    changeCurrency: function (currency) {
      this.$store.dispatch('changeCurrency', currency)
      this.$emit('closed', true)
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
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
    mainSiteLink: function() {
      let mainSiteData = this.mainSiteMap.mainSiteMap
      let mainSite = mainSiteData.find((a) => {
        return a.currency == this.$store.state.activeCurrency
      })
      if(mainSite) {
        let mainSiteUrl = 'https://' + mainSite.url + this.$route.path.replace('/' + this.$store.state.activeCurrency, '')
        return mainSiteUrl
      }
      else {
        return
      }
    }
  }
})

</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  padding-left: 20px;
  padding-right: 20px;

  .menu--mobile {
    display: none;

    @include screenSizes(tabletPortrait) {
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
  }

  .header__icons {
    position: absolute;
    right: 20px;
    top: 30px;
    display: flex;
    flex-direction: row;

    @include screenSizes(tabletPortrait) {
      display: none;
    }
  }

  .menu--desktop {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto;
    height: 100%;

    .header__logo {
      padding: 12px;
    }

    .menu__links--desktop {
      list-style: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0;
      width: 255px;

      @include screenSizes(tabletPortrait) {
        display: none;
      }

      &.links--left {
        justify-content: flex-end;
      }

      li {
        padding: 12px;
        margin: 0;
        display: flex;
        align-items: center;
      }
    }

    ul, li {
      height: 100%;
    }
  }

  .header__currency--dropdown {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: absolute;
    display: none;
    position: absolute;
    top: 35px;
    left: 0;
    flex-direction: column;

    > span {
      position: relative;
      top: 0;
      margin-right: 10px;
    }

    .header__currency--active {
      font-weight: bold;
    }
  }

  .header__currency {
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;
    margin-right: 15px;
    padding-top: 5px;
  }

  .dropdown--open {
    display: flex;
  }

  .header__cart {
    cursor: pointer;

    .header__cart-count {
      align-items: center;
      display: flex;
      font-size: 10px;
      font-weight: bold;
      height: 100%;
      justify-content: center;
      position: absolute;
      top: 2px;
      right: -21px;
      width: 100%;
    }
  }

  .logo {
    padding-top: 5px;
  }

  .menu__dropdown--men, .menu__dropdown--women {
    width: 100vw;
    // height: calc(100vh - 80px);
    height: auto;
    top: 85px;
    left: 0;
    overflow: scroll;
    padding: 60px 20px;
    margin: 0;
    margin-top: -5px;
    background: map-get($colors, 'bgGrey');
    position: absolute;

    .menu__link {
      width: fit-content;
      margin: auto;
    }
  }
}

.header--sticky {
  background: #fff;
  transition: .2s;
}

.header--grey {
  background: map-get($colors, 'bgGrey');
}
</style>
