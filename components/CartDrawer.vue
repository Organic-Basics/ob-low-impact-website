<template>
  <div :class="'cart-drawer cart-drawer--' + open">
    <header class="cart-drawer__header">
      <h3>Cart</h3>
      <span class="cart-drawer__close" @click="closeDrawer()">+</span>
    </header>
    <main class="cart-drawer__items">
      <div v-for="(item) in cleanCart" class="cart-drawer__item">
        <img class="item__image" :src="item.node.variant.image.src" :alt="item.node.title">
        <div class="item__text-container">
          <h6 class="item__heading">{{item.node.title}}</h6>
          <h6>{{item.node.variant.title}}</h6>
          <div class="cart-drawer__quantity">
            <h6 class="quant--decrement" @click="updateLineItem(item.node.variant.id, item.node.quantity - 1)">–</h6>
            <span>{{item.node.quantity}}</span>
            <h6 class="quant--increment" @click="updateLineItem(item.node.variant.id, item.node.quantity + 1)">+</h6>
           </div>
        </div>
      </div>
    </main>
    <footer class="cart-drawer__footer">
      <h6 class="footer__text--discount">
        <span>Total discount:</span>
        <span>xxxxx</span>
      </h6>
      <h6 class="footer__text--subtotal">
        <span>Subtotal</span>
        <span>xxxx</span>
      </h6>
      <a :href="cleanCheckout"><button class="cart-drawer__checkout">Checkout</button></a>
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
  background: #fff;
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

  .cart-drawer__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid map-get($colors, 'brand');
    padding: 0 0 10px;

    .cart-drawer__close {
      transform: rotate(45deg);
      font-size: 33px;
    }
  }

  .cart-drawer__items {
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    height: calc(100vh - 63px);
    overflow: scroll;
  }

  .cart-drawer__item {
    align-items: flex-start;
    border-bottom: 1px solid map-get($colors, 'brand');
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 15px 0;

    .item__image {
      width: 30%;
      margin-right: 20px;
    }

    .item__text-container {
      text-align: left;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;

      .item__heading {
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }

  .cart-drawer__item:last-child {
    border-bottom: none;
  }

  .cart-drawer__quantity {
    display: flex;
    flex-direction: row;
    font-size: 14px;

    .quant--decrement, .quant--increment, span {
      padding: 10px;
    }
  }

  .cart-drawer__footer {
    width: 100vw;
    margin-left: -15px;
    border-top: 1px solid map-get($colors, 'black');
    padding-top: 15px;

    .footer__text--discount, .footer__text--subtotal {
      font-size: 14px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: auto;
      width: calc(100vw - 30px);
      margin-bottom: 5px;
    }

    .footer__text--subtotal {
      font-weight: bold;
    }

    .cart-drawer__checkout {
      height: 3.6rem;
      text-align: center;
      background: map-get($colors, 'black');
      color: white;
      cursor: pointer;
      font-size: 14px;
      width: calc(100vw - 30px);
      border: none;
      border-radius: 0;
      font-family: 'Circular';
      margin-top: 15px;
    }
  }
}
</style>
