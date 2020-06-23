<template>
  <div>
    <header class="unavailable__header">
  		<logo/>
      <h3 class="unavailable__header--title">The low impact website is currently offline.</h3>
  	</header>
    <section class="unavailable__intro">
      <h1 class="manifesto__heading--dramatic">Offline</h1>
      <ImpactMeter />
    </section>
    <div class="unavailable__desc">
      <h6>We are performing some website maintenance and it will be ready again very soon. Drop by soon.</h6>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ImpactMeter from '~/components/ImpactMeter.vue'
import Logo from '~/components/Logo.vue'

export default Vue.extend({
  components: {
    ImpactMeter,
    Logo
  }
})
</script>

<style lang="scss">
@import "~assets/scss/mixins.scss";
@import "~assets/scss/variables.scss";

.container {
  justify-content: space-between;
}

.unavailable__header {
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;

  .logo {
    top: 20px;
    position: absolute;
  }

  .unavailable__header--title {
    margin: 5vh auto;
    font-size: 26px;
    color: map-get($colors, 'carbonHigh');
  }
}

.unavailable__intro {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  svg, p {
    padding: 0 map-get($mobile, "sidePadding");
  }

  .manifesto__heading--dramatic {
    -webkit-text-stroke: 1px map-get($colors, 'carbonHigh');
    -webkit-text-fill-color: transparent;
    margin: auto;
    position: absolute;
    margin-top: -5px;
    font-size: 8vw;

    @include screenSizesMin(largeDevices) {
      font-size: 115px;
    }

    @include screenSizes(tabletPortrait) {
      font-size: 17vw;
    }
  }

  .spedometer__container {
    width: auto;
    margin: 40px;

    @include screenSizes(phone) {
      margin: 0;
    }

    span {
      display: none;
    }

    #speedometer {
      width: 30vw;
      max-width: 100%;

      @include screenSizes(tabletPortrait) {
        width: 50vw;
      }

      @include screenSizes(phone) {
        width: 70vw;
      }
    }
  }
}

.unavailable__desc {
  max-width: 45vw;
  max-width: 500px;
  padding: 0 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>
