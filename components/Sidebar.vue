<template>
  <div :class="'sidebar sidebar--' + open">
    <h2>Sidebar</h2>
    <span @click="closeSidebar()">Close</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Sidebar',
  props: {
    open: Boolean
  },
  methods: {
    closeSidebar: function () {
      this.$emit('closed', true)
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.sidebar {
  background: map-get($colors, 'brand');
  height: 100vh;
  padding: 15px;
  position: fixed;
  transition: right 600ms ease-in-out;
  right: 100%;
  top: 0;
  width: 100vw;

  &.sidebar--true {
    right: 0%;
  }
}

</style>