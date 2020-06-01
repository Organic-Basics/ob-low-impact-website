<template>
  <div :class="'bg--grey overlay overlay--' + open">
    <header class="overlay__header">
      <p>Switch to normal website</p>
      <h5 @click="closeOverlay()">Close</h5>
    </header>

    <section>
      <ImpactMeter />
      <h5 class="overlay__carbon">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</h5>
      <h6 class="overlay__carbon--desc">Our server’s carbon intensity is currently <span class="overlay__carbon-lvl">{{carbonIntensity.index}}</span>. This site will continuously adapt to reflect the amount of renewable energy it’s running on.</h6>
      <ul class="overlay__carbon-indices">
        <li v-for="carbonIndex in carbonIndices" :class="(carbonIndex.key === carbonIntensity.index ? 'active' : '')">
          <h6>{{carbonIndex.name}}</h6>
          <h6>{{carbonIndex.description}}</h6>
        </li>
      </ul>
      <div class="overlay__questions">
        <h5 class="text--green">What, why, how?</h5>
        <img class="overlay__arrow-down" src="~/assets/svg/arrow_down.svg" alt="Arrow pointing down">
      </div>
    </section>

    <section class="bg--white">
      <h3 class="text--left">The internet uses electricity.</br>Quite a bit.</h3>
      <img class="image--data-center" src="~/assets/svg/data_center.svg" alt="Internet energy consumption illustration">

      <div class="overlay__questions--description text--left" v-for="item in threeQuestions">
        <span>{{ item.question }}</span>
        <h6>{{ item.description }}</h6>
      </div>

      <nuxt-link to="" class="text--green"><h5> WIP LINK</h5></nuxt-link>

      <h1 class="manifesto__heading--dramatic">The low impact manifesto</h1>
    </section>

    <Footer :currentBytes="footerData.currentBytes" :currentPage="footerData.currentPage" />
  </div>
</template>

<script>
import Vue from 'vue'
import Footer from '~/components/Footer.vue'
import ImpactMeter from '~/components/ImpactMeter.vue'

export default Vue.extend({
  name: 'Overlay',
  props: {
    open: Boolean,
    carbonIntensity: Object,
    footerData: Object
  },
  components: {
    Footer,
    ImpactMeter
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
  margin: 20px;
}

.overlay__carbon {
  .container-carbon--very-low & {
    color: seagreen;
  }
  .container-carbon--low & {
    color: seagreen;
  }
  .container-carbon--moderate & {
    color: gold;
  }
  .container-carbon--high & {
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
  margin-top: 20px;

  li:not(.active) {
    opacity: 0.25;
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 7px 0;
  }
}

.overlay__carbon--desc {
  padding-top: 20px;
  padding-bottom: 20px;
}

.overlay__questions {
  margin: 40px auto;

  .overlay__arrow-down {
    width: 20px;
    margin-top: 10px;
  }
}

.image--data-center {
  margin: 40px auto;
  max-width: calc(100vw - 80px);
}

.overlay__questions--description {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 30px;

  span {
    margin-right: 20px;
    min-width: 45px;
  }
}

.manifesto__heading--dramatic {
  margin: 60px auto 40px;
}

</style>
