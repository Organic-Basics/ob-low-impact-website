<template>
  <div class="spedometer__container">
    <span class="label--lowest">Lowest</span>
    <span class="label--low">Low</span>
    <span class="label--moderate">Medium</span>
    <span class="label--high">High</span>
    <span class="label--highest">Highest</span>
    <svg version="1.1" id="speedometer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 227.3 114.7" style="enable-background:new 0 0 227.3 114.7;" xml:space="preserve">
      <path class="st0" d="M113.7,1C51.4,1,1,51.5,1,113.7h225.3C226.3,51.5,175.9,1,113.7,1z"/>
      <line class="st0" x1="113.7" y1="1" x2="113.7" y2="20.4"/>
      <line class="st0" x1="57.3" y1="16.1" x2="67" y2="32.9"/>
      <line class="st0" x1="16.1" y1="57.3" x2="32.9" y2="67"/>
      <line class="st0" x1="170" y1="16.1" x2="160.3" y2="32.9"/>
      <line class="st0" x1="211.2" y1="57.3" x2="194.4" y2="67"/>
      <g>
      	<polyline class="st0" points="111.8,102.1 71.3,74.2 76.3,97.3 41.2,72.2 	"/>
      </g>
      <polyline class="st0" points="50.9,70.8 41.2,72.2 43.2,81.9 "/>
      <polyline class="st0" points="102.1,103.6 111.8,102.1 109.7,92.4 "/>
    </svg>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ImpactMeter'
})

</script>

<style lang="scss">
@import "~assets/scss/mixins.scss";
@import "~assets/scss/variables.scss";

.spedometer__container {
  pointer-events: none;
  position: relative;
  width: 28vw;
  max-width: 620px;

  span {
    opacity: .25;
  }

  @include screenSizes(desktopSmall) {
    width: 30vw;
  }

  @include screenSizes(tabletPortrait) {
    width: 60vw;
  }

  @include screenSizes(phone) {
    width: 80vw;
  }

  @mixin spedometer__label {
    font-size: 14px;
    position: absolute;
  }

  .label--moderate {
    @include spedometer__label;
    left: 45%;
    top: -18%;

    @include screenSizes(phone) {
      left: 43%;
    }

    @include screenSizesMin(largeDevices) {
      top: -10%;
    }
  }

  .label--low {
    @include spedometer__label;
    left: 20%;
    top: -5%;

    @include screenSizesMin(largeDevices) {
      top: 0;
    }
  }

  .label--lowest {
    @include spedometer__label;
    left: -3%;
    bottom: 52%;

    @include screenSizes(desktopSmall) {
      left: 0;
    }

  }

  .label--high {
    @include spedometer__label;
    right: 20%;
    top: -5%;

    @include screenSizesMin(largeDevices) {
      top: 0;
    }
  }

  .label--highest {
    @include spedometer__label;

    right: -3%;
    bottom: 52%;

    @include screenSizes(desktopSmall) {
      right: 0;
    }
  }

  #speedometer {
    width: 25vw;
    max-width: 600px;

    @include screenSizes(desktopSmall) {
      width: 23vw;
    }

    @include screenSizes(tabletPortrait) {
      width: 48vw;
    }

    @include screenSizes(phone) {
      width: 60vw;
    }

    @mixin spedometer__label {
      font-size: 14px;
      position: absolute;
    }

    path, line, g, polyline {
      stroke-width: 1px;
      stroke: map-get($colors, 'black');
      fill: none;
    }

    .container-carbon--very-low & #speedometer__needle {
      transform: rotate(45deg);
      transform-origin: 2% 84%;
    }

    .container-carbon--low & #speedometer__needle {
      transform: rotate(75deg);
      transform-origin: 20% 75%;
    }

    .container-carbon--moderate & #speedometer__needle {
      transform: rotate(105deg);
      transform-origin: 30% 66%;
    }

    .container-carbon--high & #speedometer__needle {
      transform: rotate(135deg);
      transform-origin: 37% 61%;

      #needle__line {
        transform: scale(0.8) rotate(130deg);
        transform-origin: 17% 31%;
      }

      #needle__arrow-up {
        transform-origin: 5.5% 44%;
        transform: rotate(130deg) scale(.8);
      }

      #needle__arrow-down {
        transform-origin: 28.5% 18%;
        transform: rotate(130deg) scale(.8);
      }
    }
  }
}
</style>
