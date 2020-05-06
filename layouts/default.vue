<template>
  <div>
    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'default',
  async mounted() {
    await this.$store.dispatch('fetchCheckoutId')
    await this.$store.dispatch('fetchCart')
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

@font-face {
  font-family: 'Circular';
  font-weight: bold;
  src: url('~assets/fonts/CircularAirPro-Bold-Small.woff2') format('woff2'),
       url('~assets/fonts/CircularAirPro-Bold-Small.woff') format('woff2');
}
@font-face {
  font-family: 'Circular';
  font-weight: normal;
  src: url('~assets/fonts/CircularAirPro-Book-Small.woff2') format('woff2'),
       url('~assets/fonts/CircularAirPro-Book-Small.woff') format('woff2');
}

html {
  background: map-get($colors, "black");
  color: #fff;
  font-family: 'Circular', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
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

</style>
