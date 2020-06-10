<template>
  <div :class="'cart-drawer cart-drawer--' + open">
    <header class="cart-drawer__header">
      <h3>Cart</h3>
      <span class="cart-drawer__close" @click="closeDrawer()">+</span>
    </header>
    <main class="cart-drawer__items">
      <div v-for="(item) in cleanCart" class="cart-drawer__item">
        <div class="item__image" v-html="item.node.illustration"></div>
        <div class="item__text-container">
          <h6 class="item__heading">{{item.node.title}}</h6>
          <div class="item__details">
            <div class="cart-drawer__quantity">
              <h6 class="quant--decrement" @click="updateLineItem(item, -1)">–</h6>
              <span>{{item.node.quantity}}</span>
              <h6 class="quant--increment" @click="updateLineItem(item, 1)">+</h6>
            </div>
            <h6 class="cart-drawer__title">{{item.node.variant.title}}</h6>
            <h6>{{ fetchComparePrice(item) !== 0 ? fetchComparePrice(item) : formatPrice(item.node.variant.priceV2, item.node.quantity) }}</h6>
          </div>
          <div class="item__discount">
            <span v-if="item.node.customAttributes.some((a) => (a.key === 'Bundle')) && fetchComparePrice(item) !== 0">
              {{item.node.customAttributes.find((a) => (a.key === 'Bundle')).value}}
            </span>
            <span class="item__price--compare" v-if="fetchComparePrice(item) !== 0">{{ formatPrice(item.node.variant.priceV2, item.node.quantity) }}</span>
          </div>
        </div>
      </div>
    </main>
    <footer class="cart-drawer__footer">
      <h6 class="footer__text--discount" v-if="getDiscount($store.state.cart.lineItemsSubtotalPrice, $store.state.cart.totalPriceV2).amount !== '0.00'">
        <span>Total discount: {{formatPrice(getDiscount($store.state.cart.lineItemsSubtotalPrice, $store.state.cart.totalPriceV2)) }}</span>
        <span class="footer__text--subtotal">{{formatPrice($store.state.cart.lineItemsSubtotalPrice)}}</span>
      </h6>
      <h6 class="footer__text--total">
        <span>Subtotal</span>
        <span>{{formatPrice($store.state.cart.totalPriceV2)}}</span>
      </h6>
      <a :href="cleanCheckoutURL"><button class="cart-drawer__checkout">Checkout</button></a>
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
    updateLineItem: function (item, quantity) {
      let totalQuantity = quantity
      for(let cartItem of this.cleanCart) {
        if(item.node.variant.id === cartItem.node.variant.id &&
        JSON.stringify(item.node.customAttributes) == JSON.stringify(cartItem.node.customAttributes)) {
          totalQuantity += cartItem.node.quantity
        }
      }
      this.$store.dispatch('updateLineItem',
        {variantId: item.node.variant.id, quantity: totalQuantity, customAttributes: item.node.customAttributes.map((attr) => ({key: attr.key, value: attr.value}))}
      )
    },
    formatPrice: function (price, quantity) {
      if(price !== undefined) {
        if(price.amount && price.currencyCode) {
          if(!quantity) {
            quantity = 1
          }
          let amount = parseInt(price.amount) * quantity
          let newPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currencyCode
          }).format(amount)

          if(price.currencyCode === 'DKK') newPrice = newPrice.replace('.00', '')
          return newPrice
        }
        else {
          return ''
        }
      }
      else {
        return ''
      }
    },
    fetchComparePrice: function(item) {
      if(item.node.discountAllocations.length > 0) {
        let discountAmount = parseFloat(item.node.discountAllocations[0].allocatedAmount.amount) / item.node.quantity
        let originalAmount = parseFloat(item.node.variant.priceV2.amount)
        // Must be a string
        let newPrice = {
          amount: (originalAmount - discountAmount) + '',
          currencyCode: item.node.variant.priceV2.currencyCode
        }
        return this.formatPrice(newPrice, item.node.quantity)
      }
      else {
        return 0
      }
    },
    getDiscount: function(subtotal, total) {
      if(subtotal && total) {
        let subtotalAmount = parseFloat(subtotal.amount)
        let totalAmount = parseFloat(total.amount)
        let discount = subtotalAmount - totalAmount
        return {
          amount: discount.toFixed(2),
          currencyCode: total.currencyCode
        }
      }
      else {
        return ''
      }
    }
  },
  computed: {
    cleanCart: function() {
      if(this.$store.state.cart && this.$store.state.cart.lineItems && this.$store.state.cart.lineItems.edges) {
        return this.$store.state.cart.lineItems.edges
      }
      else {
        return []
      }
    },
    cleanCheckoutURL: function() {
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
@import "~assets/scss/mixins.scss";

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
  width: 400px;
  right: 0;
  border-left: 2px solid map-get($colors, 'black');

  h6 {
    font-size: 14px;
  }

  @include screenSizes(tabletPortrait) {
    width: 100vw;
    border: none;
  }

  &.cart-drawer--true {
    left: calc(100% - 400px);

    @include screenSizes(tabletPortrait) {
      left: 0%;
    }

  }

  .cart-drawer__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid map-get($colors, 'brand');
    padding: 0 0 10px;

    .cart-drawer__close {
      cursor: pointer;
      font-size: 33px;
      transform: rotate(45deg);
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
      background: map-get($colors, 'productGrey');
      display: flex;
      min-height: 83px;
      margin-right: 20px;
      min-width: 67px;
      width: 20%;

      svg {
        width: 100%;

        *[stroke*="#"] {
          stroke: map-get($colors, 'black') !important;
        }

        *[fill*="#"] {
          fill: map-get($colors, 'productGrey') !important;
        }
      }
    }

    .item__text-container {
      text-align: left;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      justify-content: center;

      .item__heading {
        font-weight: bold;
        margin-bottom: 5px;
      }
    }
  }

  .cart-drawer__item:last-child {
    border-bottom: none;
  }

  .item__details {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .cart-drawer__quantity {
      align-items: center;
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      flex: 33%;
      font-size: 14px;
      justify-content: space-between;
      padding-right: 10px;
      max-width: 51px;

      h6 {
        cursor: pointer;
      }
    }

    .cart-drawer__title {
      flex: 33%;
    }
  }

  .item__discount {
    font-size: 11px;
    color: map-get($colors, 'brand');
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;

    .item__price--compare {
      text-decoration: line-through;
    }
  }

  .cart-drawer__footer {
    width: 400px;
    margin-left: -15px;
    border-top: 1px solid map-get($colors, 'black');
    padding-top: 15px;

    @include screenSizes(tabletPortrait) {
      width: 100vw;
    }

    .footer__text--discount, .footer__text--total {
      font-size: 14px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: auto;
      width: calc(400px - 30px);
      margin-bottom: 5px;

      @include screenSizes(tabletPortrait) {
        width: calc(100vw - 30px);
      }
    }

    .footer__text--total {
      font-weight: bold;
    }

    .footer__text--subtotal {
      text-decoration: line-through;
    }

    .cart-drawer__checkout {
      height: 3.6rem;
      text-align: center;
      background: map-get($colors, 'black');
      color: white;
      cursor: pointer;
      font-size: 14px;
      width: calc(400px - 30px);
      border: none;
      border-radius: 0;
      font-family: 'Circular';
      margin-top: 15px;

      @include screenSizes(tabletPortrait) {
        width: calc(100vw - 30px);
      }
    }
  }
}
</style>
