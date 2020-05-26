<template>
  <div :class="'sidebar sidebar--' + open">
    <div class="sidebar__header">
      <Logo />
      <span class="sidebar__close" @click="closeSidebar()">Close</span>
    </div>

    <section class="sidebar__body text--left">
      <div class="sidebar__body--women">
        <nuxt-link to="/collections/all-womens-products"><h2>Shop Women</h2></nuxt-link>
        <nuxt-link to="/collections/all-womens-products"><h3>All Women's</h3></nuxt-link>
        <nuxt-link to="/collections/all-womens-products/style-bras"><h3>Bras</h3></nuxt-link>
        <nuxt-link to="/collections/all-womens-products/style-bottoms"><h3>Bottoms</h3></nuxt-link>
        <nuxt-link to="/collections/all-womens-products/style-tops"><h3>Tees & Tops</h3></nuxt-link>
        <nuxt-link to="/collections/all-womens-products/style-socks"><h3>Socks</h3></nuxt-link>
        <nuxt-link to="/collections/all-womens-products/style-leggings"><h3>Leggings</h3></nuxt-link>
        <nuxt-link to="/collections/womens-accessories"><h3>Accessories</h3></nuxt-link>
        <nuxt-link to="/collections/womens-save-with-packs"><h3>Save with packs</h3></nuxt-link>
        <nuxt-link to="/products/e-gift-card"><h3>Gift Cards</h3></nuxt-link>
        <nuxt-link to="/collections/climate-credits"><h3>Climate credits</h3></nuxt-link>

        <nuxt-link to="/collections/womens-theme-basics"><h3>Basics</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-activewear"><h3>Activewear</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-invisible"><h3>Invisible</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-recycled-materials"><h3>Recycled materials</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-organic-cotton"><h3>Organic cotton</h3></nuxt-link>
        <nuxt-link to="/collections/womens-recycled-cashmere-winter-accessories"><h3>Recycled cashmere</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-tencel"><h3>TENCEL™</h3></nuxt-link>
        <nuxt-link to="/collections/womens-theme-silvertech"><h3>SilverTech™</h3></nuxt-link>
      </div>

      <div class="sidebar__body--men">
        <nuxt-link to="/collections/all-mens-products"><h2>Shop Men</h2></nuxt-link>
        <nuxt-link to="/collections/all-mens-products"><h3>All men's</h3></nuxt-link>
        <nuxt-link to="/collections/all-mens-products/style-bottoms"><h3>Underwear</h3></nuxt-link>
        <nuxt-link to="/collections/all-mens-products/style-socks"><h3>Socks</h3></nuxt-link>
        <nuxt-link to="/collections/all-mens-products/style-tops"><h3>Tees & Tops</h3></nuxt-link>
        <nuxt-link to="/collections/mens-accessories"><h3>Accessories</h3></nuxt-link>
        <nuxt-link to="/collections/mens-save-with-packs"><h3>Save with packs</h3></nuxt-link>
        <nuxt-link to="/products/e-gift-card"><h3>Gift cards</h3></nuxt-link>
        <nuxt-link to="/collections/climate-credits"><h3>Climate credits</h3></nuxt-link>

        <nuxt-link to="/collections/mens-theme-basics"><h3>Basics</h3></nuxt-link>
        <nuxt-link to="/collections/mens-theme-activewear"><h3>Activewear</h3></nuxt-link>
        <nuxt-link to="/collections/mens-theme-recycled-materials"><h3>Recycled materials</h3></nuxt-link>
        <nuxt-link to="/collections/mens-theme-organic-cotton"><h3>Organic cotton</h3></nuxt-link>
        <nuxt-link to="/collections/mens-recycled-cashmere-winter-accessories"><h3>Recycled cashmere</h3></nuxt-link>
        <nuxt-link to="/collections/mens-theme-tencel"><h3>TENCEL™</h3></nuxt-link>
        <nuxt-link to="/collections/mens-theme-silvertech"><h3>SilverTech™</h3></nuxt-link>
      </div>
    </section>

  </div>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'

export default Vue.extend({
  name: 'Sidebar',
  components: {
    Logo
  },
  props: {
    open: Boolean
  },
  methods: {
    closeSidebar: function () {
      this.$emit('closed', true)
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

  .sidebar__header {
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    background: map-get($colors, 'bgGrey');

    .logo {
      margin: 20px auto;
    }

    .sidebar__close {
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
