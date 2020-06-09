<template>
<div class="index">
  <section class="index__intro">
    <ImpactMeter />
    <div class="index__intro--links">
      <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-womens-products`"><h2>Shop women</h2></nuxt-link>
      <nuxt-link :to="`${$store.state.activeCurrency}/collections/all-mens-products`"><h2>Shop men</h2></nuxt-link>
    </div>
  </section>

  <section class="bg--green text--left">
    <h4 class="index__desc">The internet is dirty. Data transfer requires electricity, which creates carbon emissions — and this leads to climate change. The Low Impact website reduces data transfer by up to 96% in comparison to our regular website.</h4>
  </section>

  <section class="bg--yellow" id="manifesto">
    <h1 class="manifesto__heading--dramatic">The low impact manifesto</h1>
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

    .index__intro--links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      @include screenSizes(tabletPortrait) {
        padding-left: 20px;
      }

      a {
        text-decoration: none;
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

  .manifesto__heading--dramatic {
    margin-bottom: 90px;

    @include screenSizes(phone) {
      margin-bottom: 50px;
    }
  }
}

</style>
