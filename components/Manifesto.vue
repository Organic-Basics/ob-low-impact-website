<template lang="html">
  <div>
    <div class="manifesto__group" v-for="(point, index) in manifestoPoints">
      <h6 class="text--left"><span><b>{{ index + 1 }}. </b></span>{{ point.description }}</h6>
      <img :src="point.imgSrc" :alt="point.imgAlt">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Manifesto',
  data: () => {
    return {
      manifestoPoints: [
        {
          description: 'Does not load any images before they are actively requested by the user.',
          imgSrc: require('~/assets/svg/manifesto_1.svg'),
          imgAlt: 'Image loading illustration'
        },
        {
          description: 'Minimizes the power consumption on the users device.',
          imgSrc: require('~/assets/svg/manifesto_2.svg'),
          imgAlt: 'Minimized power consumption - battery'
        },
        {
          description: 'Adapts to reflect the amount of renewable energy it’s currently running on.',
          imgSrc: require('~/assets/svg/manifesto_3.svg'),
          imgAlt: 'Renewable energy - light bulb'
        },
        {
          description: ' Informs the user of the impact of their browsing behavior.',
          imgSrc: require('~/assets/svg/manifesto_4.svg'),
          imgAlt: 'User browsing behaviour - search icon'
        },
        {
          description: 'Does not make use of videos.',
          imgSrc: require('~/assets/svg/manifesto_5.svg'),
          imgAlt: 'Video usage - play button'
        },
        {
          description: 'Stores data locally on the user’s device to minimize data transfer.',
          imgSrc: require('~/assets/svg/manifesto_6.svg'),
          imgAlt: 'Store data locally - mobile phone data transfer'
        },
        {
          description: 'Compresses all data to the greatest extent possible.',
          imgSrc: require('~/assets/svg/manifesto_7.svg'),
          imgAlt: 'Data compression - world wide web'
        },
        {
          description: 'Loads only the most crucial programming scripts, frameworks and cookies.',
          imgSrc: require('~/assets/svg/manifesto_8.svg'),
          imgAlt: 'Loading only important scripts, frameworks and cookies'
        },
        {
          description: 'Limits the amount of light emitted by the screen.',
          imgSrc: require('~/assets/svg/manifesto_9.svg'),
          imgAlt: 'Light emitted by screens - sun illustration'
        },
        {
          description: ' Optimizes and limits the use of custom fonts.',
          imgSrc: require('~/assets/svg/manifesto_10.svg'),
          imgAlt: 'Custom fonts - typography illustration'
        }
      ]
    }
  }
})
</script>

<style lang="scss">
  .manifesto__group {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    margin: 50px auto;

    h6 {
      max-width: 42%;
      margin-right: 8%;
    }
  }

  .manifesto__group:nth-of-type(2n) {
    flex-direction: row-reverse;

    h6 {
      max-width: 42%;
      margin-left: 8%;
      margin-right: 0;
    }
  }
</style>
