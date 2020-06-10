<template lang="html">
  <div :class="'cookie-bar ' + (cookiesAccepted ? 'cookies-accepted' : '')">
    <div class="cookie-bar__container">
      <p>We use <a href="https://organicbasics.com/pages/terms" target="_blank">cookies</a> to save energy, reduce data transfer and gather statistics.</p>
      <button @click="acceptCookies()">Accept</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CookieBar',
  mounted() {
    this.$store.dispatch('fetchCookieConsent')
  },
  methods: {
    acceptCookies() {
      let cookieConsent = this.$store.state.cookieConsent
      cookieConsent = cookieConsent.map((a) => {
        if(a.type === 'statistics') {
          a.value = true
        }
        return a
      })
      this.$store.commit('updateCookieConsent', cookieConsent)
      this.$store.dispatch('saveCookieConsent')
    }
  },
  computed: {
    cookiesAccepted () {
      return this.$store.state.cookieConsent.some((a) => {
        return a.type === 'statistics' && a.value
      })
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.cookie-bar {
  background: map-get($colors, 'green');
  color: map-get($colors, 'cookieText');
  padding: 16px map-get($mobile, 'sidePadding');
  position: fixed;
  text-align: left;
  transition: bottom 600ms ease-in-out;
  max-width: 590px;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;

  @include screenSizes(tabletPortrait) {
    width: 100vw;
  }

  &.cookies-accepted {
    bottom: -120px;
  }
}

.cookie-bar__container {
  align-items: center;
  display: flex;
  justify-content: space-between;

  p {
    padding-right: 20px;
  }

  button {
    background: none;
    border: none;
    border-bottom: 2px solid map-get($colors, 'cookieTextWhite');
    color: map-get($colors, 'cookieTextWhite');
    font-size: 19px;
    font-weight: bold;
    padding: 0 0 4px;
  }

  a {
    color: map-get($colors, 'cookieTextWhite');
    font-weight: bold;
  }
}


</style>
