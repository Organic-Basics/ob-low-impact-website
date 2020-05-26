<template>
  <div class="product__select-area">
    <h3>{{propsProduct.title}} </h3>
    <button @click="$emit('switched')" v-if="propsProduct.switchId != 0 && propsProduct.switchId !== undefined">Switch to {{propsProduct.switchProduct}}</button>
    <div class="product__option product__option--color">
      <h3>Color</h3>
      <div>
        <span v-for="(color, index) in cleanOptions.color.values"
        :class="color === propsProduct.chosenColor ? 'chosen' : ''"
        @click="chooseColor(color, propsIdx)">
          {{color}} · 
          test
        </span>
      </div>
    </div>
    <div class="product__option product__option--size">
      <h3>Size</h3>
      <div>
        <span v-for="(size, index) in cleanOptions.size.values"
        :class="size === propsProduct.chosenSize ? 'chosen' : ''"
        @click="chooseSize(size, propsIdx)">
          {{size}} · 
        </span>
      </div>
    </div>

    <div class="product__text product__text--desc">
      <h4 @click="descOpen = !descOpen">Description</h4>
      <ul v-if="descOpen">
        <li v-for="(d, index) in propsProduct.tabs.desc">{{d}}</li>
      </ul>
    </div>
    <div class="product__text product__text--fit">
      <h4 @click="fitOpen = !fitOpen">Fit & Sizing</h4>
      <ul v-if="fitOpen">
        <li v-for="(fs, index) in propsProduct.tabs.fitSize">{{fs}}</li>
      </ul>
    </div>
    <div class="product__text product__text--mat">
      <h4 @click="careOpen = !careOpen">Material & Care</h4>
      <ul v-if="careOpen">
        <li v-for="(mc, index) in propsProduct.tabs.materialCare">{{mc}}</li>
      </ul>
    </div>
    <div class="product__text product__text--feat">
      <h4 @click="featOpen = !featOpen">Features</h4>
      <ul v-if="featOpen">
        <li v-for="(f, index) in propsProduct.tabs.features">{{f}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProductSelect',
  props: {
    propsProduct: Object,
    propsIdx: Number
  },
  data() {
    return {
      descOpen: false,
      fitOpen: false,
      careOpen: false,
      featOpen: false,
    }
  },
  computed: {
    cleanOptions() {
      let size = this.propsProduct.options.find((a) => a.name === 'Size')
      let color = this.propsProduct.options.find((a) => a.name === 'Color')
      return {
        size: size,
        color: color
      }
    }
  },
  methods: {
    chooseColor(color) {
      this.$emit('colorClicked', {
        color: color,
        idx: this.propsIdx
      })
    },
    chooseSize(size) {
      this.$emit('sizeClicked', {
        size: size,
        idx: this.propsIdx
      })
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.product__select-area {
  align-items: flex-start;
  border-top: 1px solid #fff;
  display: flex;
  flex-direction: column;
  padding: 10px 5px;

  h3 {
    text-align: left;
  }

  .product__option {
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    &.product__option--size {
      margin-bottom: 30px;
    }

    .chosen {
      text-decoration: underline;
    }
  }

  .product__text {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;

    ul {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      padding: 0;
      text-align: left;
    }
  }
}

</style>
