<template>
  <div :class="'cart-drawer cart-drawer--' + open">
    <header class="cart-drawer__header">
      <h3>Cart drawer</h3>
      <span @click="closeDrawer()">Close</span>
    </header>
    <main class="cart-drawer__items">
      <div v-for="(item) in cleanCart" class="cart-drawer__item">
        <div>{{item.node.quantity}} x {{item.node.title}}</div>
        <div>{{item.node.variant.title}}</div>
        <div class="cart-drawer__quantity">
          <span @click="updateLineItem(item.node.variant.id, item.node.quantity - 1)">–</span>
           / 
          <span @click="updateLineItem(item.node.variant.id, item.node.quantity + 1)">+</span>
         </div>
      </div>
    </main>
    <footer>
      <span class="cart-drawer__checkout"><a :href="cleanCheckout">Checkout</a></span>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CartDrawer',
  props: {
    open: Boolean
  },
  methods: {
    closeDrawer: function () {
      this.$emit('closed', true)
    },
    updateLineItem: function (variantId, quantity) {
      this.$store.dispatch('updateLineItem',
        {variantId: variantId, quantity: quantity}
      )
    }
  },
  computed: {
    cleanCart() {
      if(this.$store.state.cart && this.$store.state.cart.lineItems && this.$store.state.cart.lineItems.edges) {
        return this.$store.state.cart.lineItems.edges
      }
      else {
        return []
      }
    },
    cleanCheckout: function() {
      let checkoutUrls = [
        {
          oldUrl: 'aoftd.myshopify.com',
          newUrl: 'dk.organicbasics.com'
        },
        {
          oldUrl: 'euorganicbasics.myshopify.com',
          newUrl: 'organicbasics.com'
        },
        {
          oldUrl: 'ukorganicbasics.myshopify.com',
          newUrl: 'uk.organicbasics.com'
        },
        {
          oldUrl: 'usorganicbasics.myshopify.com',
          newUrl: 'us.organicbasics.com'
        }
      ]
      if(!this.$store.state.cart.webUrl) {
        return '#'
      }
      else {
        let theUrl = checkoutUrls.find((url) => this.$store.state.cart.webUrl.includes(url.oldUrl))
        if(theUrl !== undefined) {
          return this.$store.state.cart.webUrl.replace(theUrl.oldUrl, theUrl.newUrl)
        }
        else {
          return this.$store.state.cart.webUrl
        }
      }
    },
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.cart-drawer {
  align-items: flex-start;
  background: map-get($colors, 'brand');
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  position: fixed;
  transition: left 600ms ease-in-out;
  left: 100%;
  padding: 15px;
  top: 0;
  width: 100vw;

  &.cart-drawer--true {
    left: 0%;
  }
}

.cart-drawer__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.cart-drawer__items {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  justify-content: center;
  width: 100%;
}

.cart-drawer__item {
  align-items: flex-start;
  border-bottom: 1px solid white;
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  width: 100%;
}

.cart-drawer__quantity {
  span {
    cursor: pointer;
    display: inline-block;
    height: 10px;
    width: 10px;

    &:hover {
      text-decoration: overline;
    }
  }
}

</style>