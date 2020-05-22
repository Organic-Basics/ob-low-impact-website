<template>
  <div class="footer__container">
    <section class="bg--green">
      <div>
        <img src="~/assets/svg/data_icon.svg" alt="Data usage of this web page">
        <h6>This page is using <b>XXX kb</b> of data</br>(That is <b>XXX x</b> smaller the regular <b>front page</b>)</h6>
      </div>

      <div>
        <img src="~/assets/svg/energy_icon.svg" alt="Saved energy while browsing on this website">
        <h6>You’ve saved <b>XXX kg</b> of CO<sub>2</sub> so far this session<br/>(compared to browsing our regular website)</h6>
      </div>
    </section>
    <section>
      <footer>
        <h2>
          <nuxt-link to="/collections/all-womens-products">Shop Women</nuxt-link>
        </h2>
        <h2>
          <nuxt-link to="/collections/all-mens-products">Shop Men</nuxt-link>
        </h2>
        <p>Need help?<p/>
        <h6><b><a href = "mailto:support@organicbasics.com?subject=Low Energy Website inquiry">support@organicbasics.com</a></b>(~4g of CO<sub>2</sub>)</h6>
      </footer>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer'
})

</script>

<style lang="scss">
.footer__container {
  width: 100vw;
}
</style>
