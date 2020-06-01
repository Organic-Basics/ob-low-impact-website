<template>
  <div :class="'sidebar sidebar--' + open">
    <div class="sidebar__header">
      <div class="sidebar__currency">
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
        <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-womens-products`" @click.native="closeSidebar()"><h2>Shop Women</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in womensLinks" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`" @click.native="closeSidebar()"><h3>{{link.name}}</h3></nuxt-link>
      </div>

      <div class="sidebar__body--men">
        <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-mens-products`" @click.native="closeSidebar()"><h2>Shop Men</h2></nuxt-link>
        <nuxt-link v-for="(link, index) in mensLinks" :key="index" :to="`/${$store.state.activeCurrency}${link.url}`" @click.native="closeSidebar()"><h3>{{link.name}}</h3></nuxt-link>
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
  data() {
    return {
      womensLinks: [
        {
          'url' : '/collections/all-womens-products',
          'name' : 'All Women\'s'
        },
        {
          'url' : '/collections/all-womens-products/style-bras',
          'name' : 'Bras'
        },
        {
          'url' : '/collections/all-womens-products/style-bottoms',
          'name' : 'Bottoms'
        },
        {
          'url' : '/collections/all-womens-products/style-tops',
          'name' : 'Tees & Tops'
        },
        {
          'url' : '/collections/all-womens-products/style-socks',
          'name' : 'Socks'
        },
        {
          'url' : '/collections/all-womens-products/style-leggings',
          'name' : 'Leggings'
        },
        {
          'url' : '/collections/womens-accessories',
          'name' : 'Accessories'
        },
        {
          'url' : '/collections/womens-save-with-packs',
          'name' : 'Save with packs'
        },
        {
          'url' : '/products/e-gift-card',
          'name' : 'Gift Cards'
        },
        {
          'url' : '/collections/climate-credits',
          'name' : 'Climate credits'
        },
        {
          'url' : '/collections/womens-theme-basics',
          'name' : 'Basics'
        },
        {
          'url' : '/collections/womens-theme-activewear',
          'name' : 'Activewear'
        },
        {
          'url' : '/collections/womens-theme-invisible',
          'name' : 'Invisible'
        },
        {
          'url' : '/collections/womens-theme-recycled-materials',
          'name' : 'Recycled materials'
        },
        {
          'url' : '/collections/womens-theme-organic-cotton',
          'name' : 'Organic cotton'
        },
        {
          'url' : '/collections/womens-recycled-cashmere-winter-accessories',
          'name' : 'Recycled cashmere'
        },
        {
          'url' : '/collections/womens-theme-tencel',
          'name' : 'TENCEL™'
        },
        {
          'url' : '/collections/womens-theme-silvertech',
          'name' : 'SilverTech™'
        }
      ],
      mensLinks: [
        {
          'url' : '/collections/all-mens-products',
          'name' : 'All men\'s'
        },
        {
          'url' : '/collections/all-mens-products/style-bottoms',
          'name' : 'Underwear'
        },
        {
          'url' : '/collections/all-mens-products/style-socks',
          'name' : 'Socks'
        },
        {
          'url' : '/collections/all-mens-products/style-tops',
          'name' : 'Tees & Tops'
        },
        {
          'url' : '/collections/mens-accessories',
          'name' : 'Accessories'
        },
        {
          'url' : '/collections/mens-save-with-packs',
          'name' : 'Save with packs'
        },
        {
          'url' : '/products/e-gift-card',
          'name' : 'Gift cards'
        },
        {
          'url' : '/collections/climate-credits',
          'name' : 'Climate credits'
        },
        {
          'url' : '/collections/mens-theme-basics',
          'name' : 'Basics'
        },
        {
          'url' : '/collections/mens-theme-activewear',
          'name' : 'Activewear'
        },
        {
          'url' : '/collections/mens-theme-recycled-materials',
          'name' : 'Recycled materials'
        },
        {
          'url' : '/collections/mens-theme-organic-cotton',
          'name' : 'Organic cotton'
        },
        {
          'url' : '/collections/mens-recycled-cashmere-winter-accessories',
          'name' : 'Recycled cashmere'
        },
        {
          'url' : '/collections/mens-theme-tencel',
          'name' : 'TENCEL™'
        },
        {
          'url' : '/collections/mens-theme-silvertech',
          'name' : 'SilverTech™'
        }
      ]
    }
  },
  methods: {
    closeSidebar: function () {
      this.$emit('closed', true)
    },
    changeCurrency: function (currency) {
      this.$store.dispatch('changeCurrency', currency)
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

  .sidebar__currency {
    display: flex;
    flex-direction: column;
    position: absolute;

    > span {
      position: relative;
      top: 0;
    }

    .sidebar__currency--active {
      font-weight: bold;
    }
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
