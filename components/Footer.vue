<template>
  <div class="footer__container">
    <section class="bg--green">
      <div class="footer__metrics--item">
        <img src="~/assets/svg/data_icon.svg" alt="Data usage of this web page">
        <h6>This page is using <b>{{ (currentBytes / 1024).toFixed(0) }}kb</b> of data</br>(That is <b>{{pageSavingsMultiplier}}x</b> smaller than the regular <b>{{ currentPage ? currentPage.name ? currentPage.name : '...' : '...' }}</b>)</h6>
      </div>

      <div class="footer__metrics--item">
        <img src="~/assets/svg/energy_icon.svg" alt="Saved energy while browsing on this website">
        <h6>You’ve saved <b>{{ 999 }} kg</b> of CO<sub>2</sub> so far this session<br/>(compared to browsing our regular website)</h6>
      </div>
    </section>
    <section>
      <footer class="text--left">
        <h2>
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-womens-products`">Shop Women</nuxt-link>
        </h2>
        <h2>
          <nuxt-link :to="`/${$store.state.activeCurrency}/collections/all-mens-products`">Shop Men</nuxt-link>
        </h2>
        <p class="help__text">Need help?<p/>
        <h6><b><a href = "mailto:support@organicbasics.com?subject=Low Impact Website inquiry">support@organicbasics.com</a></b>(~4g of CO<sub>2</sub>)</h6>
      </footer>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
  props: {
    currentBytes: Number,
    currentPage: Object
  },
  computed: {
    pageSavingsMultiplier: function() {
      if(this.$props.currentPage && this.$props.currentPage.key) {
        return (1 / (this.$props.currentBytes / this.$props.currentPage.normalSize)).toFixed(2)
      }
      else {
        return 0
      }
    }
  }
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

  .help__text {
    margin-top: 50px;
  }
}
</style>
