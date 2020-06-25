<template>
  <div>
    <!-- Single product slideshow -->
    <div v-if="isSingleProduct" :class="{product__slideshow: true, 'illustrations--active' : !shouldShowImages}" @click="showImages()">
      <div v-html="productIllustration" v-if="!shouldShowImages && productIllustration" class="slideshow__illustration"></div>
      <div class="product__image-label" v-if="!shouldShowImages">
        <span class="product__image-label--bold">
          <span v-if="$store.state.carbonIntensity.intensity.index === 'lowest'"><span class="label__tap">Tap</span><span class="label__click">Click</span> to see real images</span>
          <span v-else-if="$store.state.carbonIntensity.intensity.index === 'moderate' || $store.state.carbonIntensity.intensity.index === 'low'"><span class="label__tap">Tap</span><span class="label__click">Click</span> to see low quality images (~{{ (lowResCost).toFixed(2)}}g CO2)</span>
          <span v-else>Real images unavailable</span>
        </span>
        <span class="product__image-label--desc">
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high' && $store.state.carbonIntensity.intensity.index !== 'moderate'">
            (~{{ ($store.state.carbonIntensity.intensity.index === 'very low' ? highResCost : lowResCost).toFixed(2)}}g CO2)
          </span>
          <span v-else-if="$store.state.carbonIntensity.intensity.index === 'moderate'">
            (Our server energy mix needs to be more green for high quality images)
          </span>
          <span v-else>
            (Our server energy mix needs to be more green)
          </span>
        </span>
      </div>
      <div v-for="(image, index) in mainProduct.images.edges" class="image-container">
        <img :src="shouldShowImages ? image.node.transformedSrc : ''" v-if="shouldShowImages">
        <div class="image__click image__click--left" @click="scrollToImage(-1, $event)"></div>
        <div class="image__click image__click--right" @click="scrollToImage(1, $event)"></div>
      </div>
    </div>
    <!-- Bundle slideshow -->
    <div v-else :class="{product__slideshow: true, 'illustrations--active' : !shouldShowImages, bundle: true}" @click="showImages()">
      <div
        :class="{
          bundle__illustrations: true,
          vertical: bundleData.quantProducts < 3
        }"
        v-if="bundleData.type === 'combo' && !shouldShowImages"
      >
        <div
          class="bundle__illustration"
          v-for="product in products"
          v-html="product.illustration"
          v-if="
            !shouldShowImages &&
              (product.switchId == 0 ||
                product.switchId == switchId ||
                product.switchId === undefined) &&
              product.illustration
          "
        ></div>
      </div>
      <div v-else-if="!shouldShowImages" class="bundle__illustrations">
        <div
          :class="{
            'bundle__illustration--quant': true,
            five: bundleData.quantProducts > 3
          }"
          v-for="product in products"
          v-html="product.illustration"
          v-if="!shouldShowImages && product.illustration"
        ></div>
      </div>
      <div class="product__image-label" v-if="!shouldShowImages">
        <span class="product__image-label--bold">
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'"
            >Tap to see real photos</span
          >
          <span v-else>Real photos unavailable</span>
        </span>
        <span>
          <span v-if="$store.state.carbonIntensity.intensity.index !== 'high'">
            (~{{
              ($store.state.carbonIntensity.intensity.index === "very low"
                ? highResCost
                : lowResCost
              ).toFixed(2)
            }}g CO2)
          </span>
          <span v-else>
            (Our server energy mix needs to be more green)
          </span>
        </span>
      </div>
      <div v-for="(image, index) in mainProduct.images.edges">
        <img
          :src="shouldShowImages ? image.node.transformedSrc : ''"
          v-if="shouldShowImages"
        />
      </div>
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
    mainProduct: Object,
    bundleData: Object,
    products: Array,
    switchId: Number
  },
  methods: {
    showImages() {
      this.$emit('showImages')
    },
    scrollToImage(direction, evt) {
      let imgContainer = evt.target.parentElement
      let nextImage
      if(direction < 0) nextImage = imgContainer.previousElementSibling
      else nextImage = imgContainer.nextElementSibling
      if(nextImage !== null) {
        let nextImagePos = nextImage.offsetLeft
        let slideshowElem = imgContainer.offsetParent
        slideshowElem.scrollLeft = nextImagePos
      }
    }
  }
})

</script>

<style lang="scss">
@import "~assets/scss/mixins.scss";

$arrowSize: 15px;

// .slideshow__illustration, .bundle__illustration:first-child {
//   @include screenSizes(phone) {
//     margin-top: -50px;
//   }
// }

.image-container {
  &:last-child .image__click--right {
    display: none;
  }
  &:first-child .image__click--left {
    display: none;
  }

  .image__click {
    align-items: center;
    display: flex;
    height: 100%;
    position: absolute;
    top: 0;
    width: 25%;

    &.image__click--right {
      justify-content: flex-end;
      right: 0;

      &::after {
        border-left: $arrowSize solid black;
        padding-left: $arrowSize;
      }
    }
    &.image__click--left {
      justify-content: flex-start;
      left: 0;

      &:first-child {
        display: none;
      }

      &::after {
        border-right: $arrowSize solid black;
        padding-right: $arrowSize;
      }
    }

    &::after {
      border-bottom: $arrowSize solid transparent;
      border-top: $arrowSize solid transparent;
      content: '';
      height: 0;
      width: 0;
    }
  }
}
</style>
