<template>
  <div :class="'overlay overlay--' + active">
    <span @click="closeOverlay()">Close</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Overlay',
  props: {
    active: Boolean
  },
  methods: {
    closeOverlay: function () {
      this.$emit('filterClosed', true)
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.overlay {
  background: map-get($colors, 'brand');
  height: 100vh;
  position: fixed;
  transition: top 600ms ease-in-out;
  top: 100%;
  width: 100vw;

  &.overlay--true {
    top: 75%;
  }
}
</style>