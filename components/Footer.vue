<template>
  <div class="footer__container">
    <section class="footer__top">
      <div class="footer__metrics bg--green">
        <div class="footer__metrics--item">
          <img src="~/assets/svg/data_icon.svg" alt="Data usage of this web page">
          <h6>This page is using ~<b>{{ (currentBytes / 1024).toFixed(0) }}kb</b> of data</br>(<b>{{this.currentSavingsMultiplier.toFixed(2)}}x</b> smaller than the regular <b>{{this.currentPage.name}}</b>)</h6>
        </div>

        <div class="footer__metrics--item">
          <img src="~/assets/svg/energy_icon.svg" alt="Saved energy while browsing on this website">
          <h6>You’ve saved ~<b>{{ totalSavings.toFixed(2) }} g</b> of CO<sub>2</sub> <br class="small-break"/>so far this session<br/>(compared to browsing<br class="small-break"/> our regular website)</h6>
        </div>
      </div>
      <div class="footer__image">
        <img src="~/assets/svg/3_girls.svg">
        <span>Illustration: @fra.ge_art</span>
      </div>
    </section>
    <section class="footer__bottom">
      <footer class="text--left">
        <h2>
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`">Shop Women</nuxt-link>
        </h2>
        <h2>
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`">Shop Men</nuxt-link>
        </h2>
        <p class="footer__help--text">Need help?<p/>
        <h6><b><a href = "mailto:hello@organicbasics.com?subject=Low Impact Website inquiry">hello@organicbasics.com</a></b>(~4g of CO<sub>2</sub>)</h6>
      </footer>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  props: {
    currentBytes: Number,
    currentSavingsMultiplier: Number,
    totalSavings: Number,
    currentPage: Object
  }
})

</script>

<style lang="scss">
@import "~assets/scss/mixins.scss";
@import "~assets/scss/variables.scss";

.footer__container {
  width: 100vw;

  h6 {
    font-size: 14px;
  }

  h2 {
    font-size: 26px;
  }

  .footer__top {
    display: flex;
    flex-direction: row;
    padding: 0;
    height: 370px;

    @include screenSizes(tabletPortrait) {
      flex-direction: column;
      height: auto;
    }

    .footer__metrics {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0;
      flex-basis: 50%;
      padding: 30px;

      @include screenSizes(tabletPortrait) {
        padding: 20px;
      }

      .footer__metrics--item {
        color: map-get($colors, 'cookieTextWhite');
        margin: 20px auto;

        @include screenSizes(tabletPortrait) {
          margin: 40px auto;
        }

        h6 {
          margin-top: 10px;
        }
      }
    }

    .footer__image {
      flex-basis: 50%;
      background: map-get($colors, 'brand');
      position: relative;
      overflow: hidden;

      img {
        position: relative;
        height: 150%;
        width: 75%;

        @include screenSizes(tabletPortrait) {
          width: 100%;
        }
      }

      span {
        position: absolute;
        bottom: 20px;
        left: 20px;
      }
    }
  }

  .footer__bottom {
    background: #D9D9D9;

    .footer__help--text {
      margin-top: 50px;
    }
  }

  .small-break {
    display: none;

    @include screenSizes(phoneSmall) {
      display: block;
    }
  }
}
</style>
