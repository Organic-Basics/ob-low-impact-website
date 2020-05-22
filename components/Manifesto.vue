<template lang="html">
  <div>
    <div v-for="point in manifestoPoints">
      <h6>{{ point.description }}</h6>
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
          imgSrc: require('~/assets/svg/manifesto/manifesto_1.svg'),
          imgAlt: 'Image loading illustration'
        },
        {
          description: 'Minimizes the power consumption on the users device.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_2.svg'),
          imgAlt: 'Minimized power consumption - battery'
        },
        {
          description: 'Adapts to reflect the amount of renewable energy it’s currently running on.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_3.svg'),
          imgAlt: 'Renewable energy - light bulb'
        },
        {
          description: ' Informs the user of the impact of their browsing behavior.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_4.svg'),
          imgAlt: 'User browsing behaviour - search icon'
        },
        {
          description: 'Does not make use of videos.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_5.svg'),
          imgAlt: 'Video usage - play button'
        },
        {
          description: 'Stores data locally on the user’s device to minimize data transfer.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_6.svg'),
          imgAlt: 'Store data locally - mobile phone data transfer'
        },
        {
          description: 'Compresses all data to the greatest extent possible.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_7.svg'),
          imgAlt: 'Data compression - world wide web'
        },
        {
          description: 'Loads only the most crucial programming scripts, frameworks and cookies.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_8.svg'),
          imgAlt: 'Loading only important scripts, frameworks and cookies'
        },
        {
          description: 'Limits the amount of light emitted by the screen.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_9.svg'),
          imgAlt: 'Light emitted by screens - sun illustration'
        },
        {
          description: ' Optimizes and limits the use of custom fonts.',
          imgSrc: require('~/assets/svg/manifesto/manifesto_10.svg'),
          imgAlt: 'Custom fonts - typography illustration'
        }
      ]
    }
  }
})
</script>

<style lang="scss">
</style>
