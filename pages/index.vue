<template>
<div>
  <section>
    <ImpactMeter />
    <div class="index__intro--links">
      <nuxt-link to="/collections/all-womens-products"><h2>Shop women</h2></nuxt-link>
      <nuxt-link to="/collections/all-mens-products"><h2>Shop men</h2></nuxt-link>
    </div>
  </section>

  <section class="bg--green text--left">
    <h4>The internet is dirty. Data transfer requires electricity, which creates carbon emissions — and this leads to climate change. The Low Impact website reduces data transfer by up to 96% in comparison to our regular website.</h4>
  </section>

  <section class="bg--yellow">
    <h1>The low impact manifesto</h1>

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


import * as CO2 from '@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  components: {
    Manifesto,
    ImpactMeter
  }
})
</script>

<style lang="scss">
.index__intro--links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  a {
    text-decoration: none;
  }
}


</style>
