<template>
  <div class="">
    <!-- Single product slideshow -->
    <!-- <div v-if="isSingleProduct" class="product__slideshow" @click="showImages()">
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
    </div> -->
    <!-- Bundle slideshow -->
    <!-- <div v-if="!isSingleProduct" class="bundle__slideshow">

    </div> -->


    <div class="product__slideshow" v-if="isSingleProduct" @click="showImages()">
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

      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(image, index) in mainProduct.images.edges">
            <img :src="shouldShowImages ? image.node.transformedSrc : ''" v-if="shouldShowImages">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'

export default Vue.extend({
  name: 'ProductSlideshow',
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  props: {
    isSingleProduct: Boolean,
    shouldShowImages: Boolean,
    productIllustration: String,
    highResCost: Number,
    lowResCost: Number,
    mainProduct: Object
  },
  data () {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          // ...
        }
      }
    },
    mounted() {
      console.log('Current Swiper instance object', this.mySwiper)
      this.mySwiper.slideTo(3, 1000, false)
    },
  methods: {
    showImages() {
      this.$emit('showImages')
    }
  }
})

</script>

<style lang="scss">
@import "swiper/swiper.scss";


</style>
