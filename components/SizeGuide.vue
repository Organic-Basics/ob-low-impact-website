<template>
    <div></div>
</template>

<script>
import Vue from 'vue'
import SizeGuidesData from '~/assets/json/size_guides.json'

export default Vue.extend({
  name: 'SizeGuide',
  data() {
    return {
        sizeGuides: SizeGuidesData
    }
  },
  mounted() {
    console.log(this.sizeGuides)
  }
})

</script>

<style lang="scss">
    
</style>