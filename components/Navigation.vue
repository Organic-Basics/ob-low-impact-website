<template>
  <header class="header" ref="header">
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
        <li>Low Impact Website</li>
        <li>Manifesto</li>
      </ul>
    </div>
    <div class="header__cart" @click="openCart()">
      <CartIcon />
      <span class="header__cart-count">{{ cartCount }}</span>
    </div>

    <!-- Desktop dropdown -->
    <div class="menu__dropdown--women" v-show="hoverWomens" @mouseover="hoverWomens=true" @mouseleave="hoverWomens=false">
        <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`"><h2>Shop Women</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in womenLinks" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`">
          <h3 class="menu__link">{{link.name}}</h3>
        </nuxt-link>
    </div>
    <div class="menu__dropdown--men" v-show="hoverMens" @mouseover="hoverMens=true" @mouseleave="hoverMens=false">
      <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`"><h2>Shop Men</h2></nuxt-link>
      <nuxt-link v-for="(link, index) in menLinks" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`">
        <h3 class="menu__link">{{link.name}}</h3>
      </nuxt-link>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'

import Logo from '~/components/Logo.vue'
import CartIcon from '~/components/CartIcon.vue'

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
      hoverMens: false
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
    },
    openSidebar: function() {
      this.$emit('openSidebar')
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
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

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

  .menu--desktop {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;

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
      }
    }
  }

  .header__cart {
    cursor: pointer;
    margin-left: auto;

    .header__cart-count {
      position: absolute;
      top: 25px;
      right: 20px;
      font-size: 10px;

      @include screenSizes(tabletPortrait) {
        top: 20px;
      }
    }
  }

  .logo {
    padding-top: 5px;
  }

  .menu__dropdown--men, .menu__dropdown--women {
    width: 100vw;
    height: 70vh;
    top: 54px;
    left: 0;
    overflow: scroll;
    padding: 30px 10px;
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
</style>
