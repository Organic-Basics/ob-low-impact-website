<template>
  <div :class="'sidebar sidebar--' + open">
    <div class="sidebar__header">
      <div class="sidebar__currency">
        <span  @click="toggleDropdown">{{$store.state.activeCurrency}}</span>
      </div>
      <div :class="{'sidebar__currency--dropdown': true,'dropdown--open': isOpen}">
        <span @click="changeCurrency('eur')" :class="$store.state.activeCurrency === 'eur' ? 'sidebar__currency--active' : ''">EUR</span>
        <span @click="changeCurrency('dkk')" :class="$store.state.activeCurrency === 'dkk' ? 'sidebar__currency--active' : ''">DKK</span>
        <span @click="changeCurrency('gbp')" :class="$store.state.activeCurrency === 'gbp' ? 'sidebar__currency--active' : ''">GBP</span>
        <span @click="changeCurrency('usd')" :class="$store.state.activeCurrency === 'usd' ? 'sidebar__currency--active' : ''">USD</span>
      </div>
      <Logo />
      <span class="sidebar__close" @click="closeSidebar()">Close</span>
    </div>
    <section class="sidebar__body text--left">
      <div class="sidebar__body--women">
        <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`" @click.native="closeSidebar()"><h2>Shop Women</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in menuLinks.menuLinks.womens" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`" @click.native="closeSidebar()"><h3>{{link.name}}</h3></nuxt-link>
      </div>

      <div class="sidebar__body--men">
        <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`" @click.native="closeSidebar()"><h2>Shop Men</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in menuLinks.menuLinks.mens" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`" @click.native="closeSidebar()"><h3>{{link.name}}</h3></nuxt-link>
      </div>
    </section>

  </div>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import menuLinks from '~/assets/json/menuLinks.json'

export default Vue.extend({
  name: 'Sidebar',
  components: {
    Logo
  },
  props: {
    open: Boolean
  },
  data: () => {
    return {
      menuLinks: menuLinks,
      isOpen: false
    }
  },
  methods: {
    closeSidebar: function () {
      this.$emit('closed', true)
      this.isOpen = false
    },
    changeCurrency: function (currency) {
      this.$store.dispatch('changeCurrency', currency)
      this.$emit('closed', true)
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.sidebar {
  background: map-get($colors, 'bgGrey');
  height: 100vh;
  position: fixed;
  transition: right 600ms ease-in-out;
  right: 100%;
  top: 0;
  width: 100vw;
  overflow: scroll;

  &.sidebar--true {
    right: 0%;
  }

  .sidebar__currency--dropdown {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: absolute;
    display: none;
    position: absolute;
    top: 60px;
    left: 20px;
    flex-direction: row;

    > span {
      position: relative;
      top: 0;
      margin-right: 10px;
    }

    .sidebar__currency--active {
      font-weight: bold;
    }
  }

  .sidebar__currency {
    position: absolute;
    top: 20px;
    left: 20px;
    text-transform: uppercase;
    font-weight: bold;
  }

  .dropdown--open {
    display: flex;
  }

  .sidebar__header {
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    background: map-get($colors, 'bgGrey');
    padding-bottom: 15px;

    .logo {
      margin: 20px auto;
    }

    .sidebar__close {
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }

  .sidebar__body {
    padding: map-get($mobile, 'sectionPadding');
    margin-top: 100px;
    margin-left: 20px;

    h3 {
      margin-left: 25px;
      margin-top: 8px;
    }

    .sidebar__body--women, .sidebar__body--men {
      margin-bottom: 40px;
    }
  }
}

</style>
