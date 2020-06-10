<template>
  <div :class="'bg--grey overlay overlay--' + open">
    <header class="overlay__header">
      <h5 @click="closeOverlay()">Close</h5>
    </header>

    <section class="overlay__body">
      <ImpactMeter />
      <h5 class="overlay__carbon">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</h5>
      <div class="overlay__text--container">
        <h6 class="overlay__carbon--desc">Our server’s carbon intensity is currently <span class="overlay__carbon-lvl">{{ carbonIndexName }}</span>. This site will continuously adapt to reflect the amount of renewable energy it’s running on.</h6>
        <ul class="overlay__carbon-indices">
          <li v-for="carbonIndex in carbonIndices" :class="(carbonIndex.key === carbonIntensity.index ? 'active' : '')">
            <h6>{{carbonIndex.name}}</h6>
            <h6>{{carbonIndex.description}}</h6>
          </li>
        </ul>
      </div>
      <div class="overlay__questions">
        <h5 class="text--green">What, why, how?</h5>
        <img class="overlay__arrow-down" src="~/assets/svg/arrow_down.svg" alt="Arrow pointing down">
      </div>
    </section>

    <section class="bg--white">
      <h2 class="text--left">The internet uses electricity.</br>Quite a bit.</h2>
      <img class="image--data-center" src="~/assets/svg/data_center.svg" alt="Internet energy consumption illustration">

      <div class="overlay__questions--container">
        <div class="overlay__questions--description text--left" v-for="item in threeQuestions">
          <span>{{ item.question }}</span>
          <h6>{{ item.description }}</h6>
        </div>
      </div>

      <nuxt-link :to="'/' + $store.state.activeCurrency + '#manifesto'">
        <h1 @click="closeOverlay()" class="manifesto__heading--dramatic"><span>The</span> low impact <span>manifesto</span></h1>
      </nuxt-link>

    </section>

    <Footer :currentBytes="footerData.currentBytes" :currentSavingsMultiplier="footerData.currentSavingsMultiplier" :currentPage="footerData.currentPage" :totalSavings="footerData.totalSavings"/>
  </div>
</template>

<script>
import Vue from 'vue'
import Footer from '~/components/Footer.vue'
import ImpactMeter from '~/components/ImpactMeter.vue'
import mainSiteMap from '~/assets/json/mainSiteMap.json'

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
          key: 'very-low',
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
          key: 'very-high',
          name: 'Highest',
          description: 'Our site closes down'
        }
      ],
      threeQuestions: [
        {
          question: 'What?',
          description: 'The Low Impact version of our website reduces the carbon emissions associated with online shopping by up to 70% in comparison to our regular site. This is done by getting rid of most of the data-heavy elements like images and videos.'
        },
        {
          question: 'Why?',
          description: 'The Internet is accountable for 3.7% of the world’s carbon emissions. This is because an enormous amount of electricity is required to run data transfer centers around the world.'
        },
        {
          question: 'How?',
          description: 'We have formulated a set of 10 guidelines to help radically limit the amount of data transfer required to run an online store or website. We call it “The Low Impact Manifesto”.'
        }
      ],
      mainSiteMap: mainSiteMap
    }
  },
  methods: {
    closeOverlay: function () {
      this.$emit('closed', true)
    }
  },
  computed: {
    carbonIndexName () {
      let carbonName = this.carbonIndices.find((a) => {
        return a.key === this.$props.carbonIntensity.index
      })
      if(carbonName) return carbonName.name.toLowerCase()
      else return '...'
    },
    mainSiteLink () {
      let mainSiteData = this.mainSiteMap.mainSiteMap
      let mainSite = mainSiteData.find((a) => {
        return a.currency == this.$store.state.activeCurrency
      })
      let mainSiteUrl = 'https://' + mainSite.url + this.$route.path.replace('/' + this.$store.state.activeCurrency, '')
      return mainSiteUrl
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.overlay {
  background: map-get($colors, 'bgGrey');
  height: calc(100vh - 80px);
  overflow-y: scroll;
  position: fixed;
  transition: top 600ms ease-in-out;
  top: 100%;
  width: 100vw;

  &.overlay--true {
    top: 80px;
  }

  .manifesto__heading--dramatic {
    margin-bottom: 90px;
    margin-top: 90px;

    span {
      -webkit-text-fill-color: map-get($colors, 'green');;
    }

    @include screenSizes(phone) {
      margin-bottom: 50px;
      margin-top: 50px;
    }

    @include screenSizes(tabletPortrait) {
      flex-direction: column;
      display: flex;
      text-align: left;
      width: 75vw;
      margin: 30px auto 70px;
      font-size: 47px;

      span:nth-child(1) {
        text-align: center;
      }
      span:nth-child(2) {
        text-align: right;
      }
    }
  }
}

.overlay__header {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 20px;

  h5 {
    cursor: pointer;
  }
}

.overlay__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .overlay__text--container {
    position: absolute;
    display: flex;
    flex-direction: row;
    width: 95vw;
    padding: 30px 0;
    justify-content: space-between;
    margin: auto;
    align-items: center;


    @media screen and (max-width: 960px) {
      padding: 0;
      width: 100%;
      position: unset;
      flex-direction: column;
    }

    .overlay__carbon--desc {
      max-width: 25vw;
      text-align: left;
      padding-top: 20px;
      padding-bottom: 20px;


      @media screen and (max-width: 960px) {
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
    }

    .overlay__carbon-indices {
      list-style: none;
      padding: 0;
      text-align: left;
      margin-top: 20px;
      width: 25vw;

      @include screenSizes(desktopSmall) {
        width: auto;
        max-width: 400px;
      }

      @media screen and (max-width: 960px) {
        width: 100%;
      }

      li:not(.active) {
        opacity: 0.25;
      }

      li {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 7px 0;

        h6:first-child {
          margin-right: 25px;
        }
      }
    }
  }

  .spedometer__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    // width: 28vw;
    //
    // @include screenSizes(desktopSmall) {
    //   width: 30vw;
    // }

    // @include screenSizes(tabletPortrait) {
    //   display: block;
    //   width: unset;
    // }

    // #speedometer {
    //   width: 23vw;
    //
    //   @include screenSizes(tabletPortrait) {
    //     width: 90%;
    //   }
    // }

    /*.label--highest {
      left: 12.5vw;
      top: 6vw;
    }

    .label--lowest {
      left: -12.5vw;
      top: 10vw;
    }

    .label--low {
      left: -7vw;
    }

    .label--high {
      left: 7vw;
    }*/
  }
}

.overlay__carbon {
  .container-carbon--very-low & {
    color: map-get($colors, 'green');;
  }
  .container-carbon--low & {
    color: map-get($colors, 'green');;
  }
  .container-carbon--moderate & {
    color: map-get($colors, 'impactYellow');
  }
  .container-carbon--high & {
    color: map-get($colors, 'carbonHigh');
  }
}

.overlay__carbon-lvl {
  font-weight: bold;
}

.overlay__questions {
  margin: 40px auto;
  font-weight: bold;

  .overlay__arrow-down {
    width: 20px;
    margin-top: 10px;
  }
}

.image--data-center {
  margin: 40px auto;
  max-width: calc(100vw - 80px);
}

.overlay__questions--container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 60px auto;

  @include screenSizes(tabletPortrait) {
    flex-direction: column;
    align-items: center;
  }

  .overlay__questions--description {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 30px;
    max-width: 360px;

    span {
      margin-right: 20px;
      min-width: 45px;
      max-width: auto;
    }
  }
}

</style>
