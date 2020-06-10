<template>
<div class="manifesto__container">
  <div class="manifesto__group" v-for="(point, index) in manifestoPoints">
    <div class="manifesto__inner">
      <h6 class="manifesto__text text--left"><span><b>{{ index + 1 }}. </b></span>{{ point.description }}</h6>
      <img :src="point.imgSrc" :alt="point.imgAlt">
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Manifesto',
  data: () => {
    return {
      manifestoPoints: [{
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
@import "~assets/scss/mixins.scss";

.manifesto__container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 80vw;
    max-width: 1200px;
    margin: 90px auto;

    @include screenSizes(tabletPortrait) {
        margin: auto 0;
        width: 100%;
    }

    .manifesto__group {
        width: 100%;
        display: inline-flex;

        &:nth-child(3n) {
            justify-content: flex-start;
        }

        &:nth-child(3n+2) {
            justify-content: center;
        }

        &:nth-child(3n+3) {
            justify-content: flex-end;
        }

        // not working
        &:nth-child(2n) {
            .manifesto__inner {
                flex-direction: row-reverse;

                .manifesto__text {
                    margin-left: 5%;

                    @include screenSizes(tabletPortrait) {
                        max-width: 42%;
                        margin-left: 8%;
                        margin-right: 0;
                    }
                }
            }
        }

        @include screenSizes(desktopSmall) {
            margin: 20px auto;
        }

        @include screenSizes(phone) {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: center;
        }

        .manifesto__inner {
          align-items: center;
          display: flex;
          flex-direction: row;

          @include screenSizes(tabletPortrait) {
            justify-content: space-between;
          }

          .manifesto__text {
            max-width: 194px;
            margin-right: 8%;
          }
        }
    }
}
</style>
