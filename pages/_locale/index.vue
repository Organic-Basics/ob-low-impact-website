<template>
<div class="index">
  <section class="index__intro">
    <ImpactMeter />
    <h1 class="manifesto__heading--dramatic">Low</br>impact</br>website</h1>
    <div class="index__intro--container">
      <div class="index__intro--links">
        <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-womens-products`"><h2>Shop women</h2></nuxt-link>
        <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-mens-products`"><h2>Shop men</h2></nuxt-link>
      </div>
      <li><nuxt-link :to="'/' + $store.state.activeCurrency + '#manifesto'">
        <img src="~/assets/svg/scroll.svg" alt="Scroll down arrow">
      </nuxt-link></li>
    </div>
  </section>

  <section class="bg--green text--left">
    <h4 class="index__desc">The internet is dirty. Data transfer requires electricity, which creates carbon emissions — and this leads to climate change. The Low Impact website reduces data transfer by up to 66% in comparison to our regular website.</h4>
  </section>

  <section class="bg--yellow" id="manifesto">
    <h1 class="manifesto__heading--dramatic"><span>The</span> low impact <span>manifesto</span></h1>
    <h4 class="text--black">A Low Impact website:</h4>
    <Manifesto />
  </section>

</div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
import Manifesto from '~/components/Manifesto.vue'
import ImpactMeter from '~/components/ImpactMeter.vue'

export default Vue.extend({
  components: {
    Manifesto,
    ImpactMeter
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.index {
  width: 100%;

  .index__intro {
    padding-top: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    @include screenSizes(phone) {
      height: 100vh;
      justify-content: flex-start;
      padding-top: 18vh;
    }

    .manifesto__heading--dramatic {
      max-width: 40vw;
      margin: auto;
      margin-top: -90px;
      font-size: 8vw;
      line-height: 10.5vw;
      position: absolute;

      @include screenSizes(tabletPortrait) {
        margin-top: -70px;
      }

      @include screenSizes(phone) {
        font-size: 15vw;
        max-width: 90vw;
        line-height: 25vw;
        margin-top: -85px;
      }
    }

    .spedometer__container {
      height: auto;
      span {
        display: none;
      }
    }

    .index__intro--container {
      width: 100vw;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-left: 30px;
      padding-right: 30px;
      margin-top: 50px;

      @include screenSizes(tabletPortrait) {
        padding-left: 20px;
        margin-top: 40px;
      }

      @include screenSizes(phone) {
        margin-top: 12vh;
      }

      li {
        list-style-type: none;
        margin-right: 15vw;
        margin-top: -100px;

        @include screenSizes(tabletPortrait) {
          margin-right: 10vw;
        }

        @include screenSizes(phone) {
          margin-right: 0;
          margin-top: 0;
        }
      }

      .index__intro--links {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        a {
          text-decoration: none;
        }
      }
    }
  }

  .index__desc {
    width: 40vw;
    display: flex;
    flex-direction: row;
    margin-right: 7vw;
    max-width: 435px;

    @include screenSizes(tabletPortrait) {
      margin: auto;
      width: auto;
    }
  }

  #manifesto .manifesto__heading--dramatic {
    @include screenSizes(tabletPortrait) {
      flex-direction: column;
      display: flex;
      text-align: left;
      width: 75vw;
      margin: 30px auto 70px;

      span:nth-child(1) {
        text-align: center;
      }
      span:nth-child(2) {
        text-align: right;
      }
    }
  }

  .manifesto__heading--dramatic {
    margin-bottom: 90px;
    margin-top: 90px;

    span {
      -webkit-text-fill-color: map-get($colors, 'green');;
    }

    @include screenSizes(phone) {
      margin-bottom: 50px;
      margin-top: 50px;
    }

    @include screenSizes(tabletPortrait) {
      font-size: 47px;
    }
  }
}

</style>
