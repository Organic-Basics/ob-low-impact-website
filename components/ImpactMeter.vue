<template>
  <div class="spedometer__container">
    <span class="label--lowest">Lowest</span>
    <span class="label--low">Low</span>
    <span class="label--moderate">Medium</span>
    <span class="label--high">High</span>
    <span class="label--highest">Highest</span>
    <svg id="speedometer" viewBox="0 0 240 133" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Low Impact Speedometer</title>
      <g id="Mobile" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="iPhone-11-Pro-Copy-124" transform="translate(-69.000000, -343.000000)">
              <g id="low-impact-speedometer-01-copy" transform="translate(70.913953, 344.983721)">
                  <path d="M118.451592,0.418926938 C53.3084529,0.418926938 0.418926938,53.3084529 0.418926938,118.451592 L236.379525,118.451592 C236.379525,53.3084529 183.594731,0.418926938 118.451592,0.418926938 Z" id="Path" stroke="#000000" stroke-width="2"></path>
                  <line x1="118.451592" y1="0.418926938" x2="118.451592" y2="20.7368834" id="Path" stroke="#000000" stroke-width="2"></line>
                  <line x1="59.3828935" y1="16.2334189" x2="69.5418718" y2="33.8283503" id="Path" stroke="#000000" stroke-width="2"></line>
                  <line x1="16.2334189" y1="59.3828935" x2="33.8283503" y2="69.5418718" id="Path" stroke="#000000" stroke-width="2"></line>
                  <line x1="177.415558" y1="16.2334189" x2="167.25658" y2="33.8283503" id="Path" stroke="#000000" stroke-width="2"></line>
                  <line x1="220.565033" y1="59.3828935" x2="202.970102" y2="69.5418718" id="Path" stroke="#000000" stroke-width="2"></line>
                  <g id="speedometer__needle" transform="translate(118.410401, 48.900495)">
                      <polyline id="needle__line" stroke="#000000" stroke-width="2" transform="translate(41.258099, 40.630205) rotate(130.000000) translate(-41.258099, -40.630205) " points="79.694646 57.2301847 37.1735618 28.0100307 42.4101485 52.2030614 2.82155283 24.0302248"></polyline>
                      <polygon id="needle__arrow-up" fill="#000000" fill-rule="nonzero" transform="translate(9.336072, 58.551089) rotate(130.000000) translate(-9.336072, -58.551089) " points="12.6874878 52.0577213 10.8023166 52.4766483 12.8969513 61.7977726 3.47109517 63.1592852 3.78529037 65.0444564 15.2010494 63.3687487"></polygon>
                      <polygon id="needle__arrow-down" fill="#000000" fill-rule="nonzero" transform="translate(73.140012, 22.675660) rotate(130.000000) translate(-73.140012, -22.675660) " points="78.7955256 16.2346588 79.0049891 18.2245618 69.579133 19.3766108 71.4643042 28.6977352 69.579133 29.1166622 67.2750348 17.8056348"></polygon>
                  </g>
              </g>
          </g>
      </g>
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
    font-size: 12px;
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
      font-size: 12px;
      position: absolute;
    }

    path, line, g, polyline, polygon {
      stroke-width: 2px;
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
