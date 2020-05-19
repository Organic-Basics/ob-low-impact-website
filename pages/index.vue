<template>
  <div>
    <h2>
      <nuxt-link to="/collections/all-womens-products">All women's</nuxt-link>
    </h2>
    <h2>
      <nuxt-link to="/collections/all-mens-products">All men's</nuxt-link>
    </h2>
  </div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

import * as CO2 from '@tgwf/co2/src/co2.js'
const emissions = new CO2()

export default Vue.extend({
  
})
</script>

<style lang="scss">



</style>
