<template>
  <div>
    <header class="unavailable__header">
  		<logo/>
      <h3 class="unavailable__header--title">The low impact website is currently offline.</h3>
  	</header>
    <section class="unavailable__intro">
      <h1 class="manifesto__heading--dramatic">Low</br>impact</br>website</h1>
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

    @include screenSizes(phone) {
      margin-top: 0;
    }
  }
}

.unavailable__intro {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px 20px;

  svg, p {
    padding: 0 map-get($mobile, "sidePadding");
  }

  .manifesto__heading--dramatic {
    max-width: 40vw;
    margin: auto;
    margin-top: -5px;
    font-size: 6vw;
    line-height: 10vw;
    position: absolute;

    @include screenSizes(tabletPortrait) {
      font-size: 11vw;
      line-height: 15vw;
    }

    @include screenSizes(phone) {
      max-width: 90vw;
      font-size: 14vw;
      line-height: 20vw;

    }

    @include screenSizes(largeDevices) {
      font-size: 115px;
      line-height: 170px;
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
  margin-top: 30px;
  padding: 0 20px;
}
</style>
