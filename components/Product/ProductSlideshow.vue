<template>
  <div class="">
    <!-- Single product slideshow -->
    <div v-if="isSingleProduct" class="product__slideshow" @click="showImages()">
      <div v-html="productIllustration" v-if="!shouldShowImages && productIllustration"></div>
      <div class="product__image-label" v-if="!shouldShowImages">
        <span class="product__image-label--bold">
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'">Tap to see real photos</span>
          <span v-else>Real photos unavailable</span>
        </span>
        <span>
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'">
            (~{{ ($store.state.carbonIntensity.intensity.index === 'very low' ? highResCost : lowResCost).toFixed(2)}}g CO2)
          </span>
          <span v-else>
            (Our server energy mix needs to be more green)
          </span>
        </span>
      </div>
      <div v-for="(image, index) in mainProduct.images.edges">
        <img :src="shouldShowImages ? image.node.transformedSrc : ''" v-if="shouldShowImages">
      </div>
    </div>
    <!-- Bundle slideshow -->
    <div v-if="!isSingleProduct" class="bundle__slideshow">

    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProductSlideshow',
  props: {
    isSingleProduct: Boolean,
    shouldShowImages: Boolean,
    productIllustration: String,
    highResCost: Number,
    lowResCost: Number,
    mainProduct: Object
  },
  methods: {
    showImages() {
      this.$emit('showImages')
    }
  }
})

</script>

<style lang="scss">
</style>
