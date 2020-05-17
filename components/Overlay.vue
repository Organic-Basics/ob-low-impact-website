<template>
  <div :class="'overlay overlay--' + open">
    <header class="overlay__header">
      <span>Switch to normal website</span>
      <span @click="closeOverlay()">Close</span>
    </header>
    <div>
      <div>Meter illustration</div>
      <p :class="'overlay__carbon overlay__carbon--' + carbonIntensity.index">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</p>
      <p>Our server’s carbon intensity is currently <span class="overlay__carbon-lvl">{{carbonIntensity.index}}</span>. This site will continuously adapt to reflect the amount of renewable energy it’s running on.</p>
      <ul class="overlay__carbon-indices">
        <li v-for="carbonIndex in carbonIndices" :class="(carbonIndex.key === carbonIntensity.index ? 'active' : '')">
          <span>{{carbonIndex.name}}</span>
          <span>{{carbonIndex.description}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Overlay',
  props: {
    open: Boolean
  },
  data() {
    return {
      carbonIndices: [
        {
          key: 'very low',
          name: 'Lowest',
          description: 'Full resolution photos available'
        },
        {
          key: 'low',
          name: 'Low',
          description: 'No animations available'
        },
        {
          key: 'moderate',
          name: 'Medium',
          description: 'Low quality photos available'
        },
        {
          key: 'high',
          name: 'High',
          description: 'Only illustrations available'
        },
        {
          key: 'very high',
          name: 'Highest',
          description: 'Our site closes down'
        }
      ]
    }
  },
  methods: {
    closeOverlay: function () {
      this.$emit('closed', true)
    }
  },
  computed: {
    carbonIntensity: function() {
      if(!this.$store.state.carbonIntensity.intensity) {
        return '...'
      }
      else {
        this.$store.state.carbonIntensity.intensity.index = this.$store.state.carbonIntensity.intensity.index.replace(' ', '-')
        return this.$store.state.carbonIntensity.intensity
      }
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.overlay {
  background: map-get($colors, 'brand');
  height: 100vh;
  overflow-y: scroll;
  padding: 15px;
  position: fixed;
  transition: top 600ms ease-in-out;
  top: 100%;
  width: 100vw;

  &.overlay--true {
    top: 0%;
  }
}

.overlay__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.overlay__carbon {
  &.overlay__carbon--low {
    color: seagreen;
  }
  &.overlay__carbon--moderate {
    color: gold;
  }
  &.overlay__carbon--high {
    color: tomato;
  }
}

.overlay__carbon-lvl {
  font-weight: bold;
}

.overlay__carbon-indices {
  list-style: none;
  padding: 0;
  text-align: left;

  li:not(.active) {
    opacity: 0.25;
  }
}

</style>