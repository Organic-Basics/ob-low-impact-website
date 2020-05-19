<template>
  <div :class="'bg--grey overlay overlay--' + open">
    <header class="overlay__header">
      <span>Switch to normal website</span>
      <span @click="closeOverlay()">Close</span>
    </header>

    <section>
      <div>Meter illustration</div>
      <h5 :class="'overlay__carbon overlay__carbon--' + carbonIntensity.index">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</h5>
      <h6>Our server’s carbon intensity is currently <span class="overlay__carbon-lvl">{{carbonIntensity.index}}</span>. This site will continuously adapt to reflect the amount of renewable energy it’s running on.</h6>
      <ul class="overlay__carbon-indices">
        <li v-for="carbonIndex in carbonIndices" :class="(carbonIndex.key === carbonIntensity.index ? 'active' : '')">
          <h6>{{carbonIndex.name}}</h6>
          <h6>{{carbonIndex.description}}</h6>
        </li>
      </ul>
      <div>
        <h5 class="text--green">Whay, why, how?</h5>
      </div>
    </section>

    <section class="bg--white">
      <h3 class="text--left">The internet uses electricity.</br>Quite a bit.</h3>
      <img src="~/assets/svg/data_center.svg" alt="Internet energy consumption illustration">

      <div v-for="item in threeQuestions">
        <span>{{ item.question }}</span>
        <h6>{{ item.description }}</h6>
      </div>

      <nuxt-link to="" class="text--green"><h5> WIP LINK</h5></nuxt-link>

      <h1>The low impact manifesto</h1>
    </section>

    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import Footer from '~/components/Footer.vue'

export default Vue.extend({
  name: 'Overlay',
  props: {
    open: Boolean
  },
  components: {
    Footer
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
      ],
      threeQuestions: [
        {
          question: 'What?',
          description: 'The Low Impact version of our website reduces the carbon emissions associated with online shopping by up to 96% in comparison to our regular site. This is done by getting rid of most of the data-heavy elements like images and videos.'
        },
        {
          question: 'Why?',
          description: 'The Internet is accountable for 3.7% of the world’s carbon emissions. This is because an enormous amount of electricity is required to run data transfer centers around the world.'
        },
        {
          question: 'How?',
          description: 'We have formulated a set of 10 guidelines to help radically limit the amount of data transfer required to run an online store or website. We call it “The Low Impact Manifesto”.'
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
