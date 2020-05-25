<template>
  <div class="footer__container">
    <section class="bg--green">
      <div class="footer__metrics--item">
        <img src="~/assets/svg/data_icon.svg" alt="Data usage of this web page">
        <h6>This page is using <b>XXX kb</b> of data</br>(That is <b>XXX x</b> smaller the regular <b>front page</b>)</h6>
      </div>

      <div class="footer__metrics--item">
        <img src="~/assets/svg/energy_icon.svg" alt="Saved energy while browsing on this website">
        <h6>You’ve saved <b>XXX kg</b> of CO<sub>2</sub> so far this session<br/>(compared to browsing our regular website)</h6>
      </div>
    </section>
    <section>
      <footer class="text--left">
        <nuxt-link class="footer__links" to="/collections/all-womens-products"><h3>Shop Women</h3></nuxt-link>
        <nuxt-link class="footer__links" to="/collections/all-mens-products"><h3>Shop Men</h3></nuxt-link>
        <div class="footer__help">
          <p>Need help?<p/>
          <h6>
            <a href="mailto:support@organicbasics.com?subject=Low Energy Website inquiry"><b>support@organicbasics.com</b></a>
            (2g of CO<sub>2</sub>)
          </h6>
        </div>
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

  .footer__metrics--item {
    margin: 40px auto;

    h6 {
      margin-top: 10px;
    }
  }

  .footer__links {
    text-decoration: none;
  }

  .footer__help {
    margin-top: 60px;
  }
}
</style>
