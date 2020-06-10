<template>
  <div>
    <!-- Single product slideshow -->
    <div v-if="isSingleProduct" :class="{product__slideshow: true, 'illustrations--active' : !shouldShowImages}" @click="showImages()">
      <div v-html="productIllustration" v-if="!shouldShowImages && productIllustration" class="slideshow__illustration"></div>
      <div class="product__image-label" v-if="!shouldShowImages">
        <span class="product__image-label--bold">
          <span v-if="$store.state.carbonIntensity.intensity.index === 'lowest' || $store.state.carbonIntensity.intensity.index === 'low'"><span class="label__tap">Tap</span><span class="label__click">Click</span> to see real images</span>
          <span v-else-if="$store.state.carbonIntensity.intensity.index === 'moderate'"><span class="label__tap">Tap</span><span class="label__click">Click</span> to see low quality images (~{{ (lowResCost).toFixed(2)}}g CO2)</span>
          <span v-else>Real images unavailable</span>
        </span>
        <span>
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
      <div v-for="(image, index) in mainProduct.images.edges">
        <img :src="shouldShowImages ? image.node.transformedSrc : ''" v-if="shouldShowImages">
      </div>
    </div>
    <!-- Bundle slideshow -->
    <div v-else :class="{product__slideshow: true, 'illustrations--active' : !shouldShowImages, bundle: true}" @click="showImages()">
      <div
        :class="{
          bundle__illustrations: true,
          vertical: bundleData.quantProducts < 3
        }"
        v-if="bundleData.type === 'combo'"
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
      <div v-else class="bundle__illustrations">
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
      <!-- <span
        class=" product__image-quant variant--black"
        v-if="!shouldShowImages && bundleData.type === 'quant'"
      >
        <span class="product__bundle--quant">
          x {{ products.length }}
        </span></span
      > -->
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
    products: Array
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
