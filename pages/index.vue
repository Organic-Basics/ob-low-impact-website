<template>
<div>
  <span></span>
</div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'

export default Vue.extend({
  async beforeMount() {
    await this.$store.dispatch('fetchActiveCurrency')
    this.$router.push(`${this.$store.state.activeCurrency}`)
  }
})
</script>

<style lang="scss">

</style>
