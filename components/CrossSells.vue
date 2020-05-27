<template>
  <section class="product__crosssells text--left">
    <h4>We thought you might like these as well...</h4>
    <div class="slider__container">
      <div class="product__crosssells--container">
        <div v-for="product in crossSells" class="product__crosssells--single">
          <a :href="product.link" class="product__crosssells--anchor">
            <img :src="product.image" alt="">
            <div class="product__crosssells--text">
              <span class="product__crosssells--title">{{product.title}}</span>
              <span class="product__crosssells--price">{{product.price}}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CrossSells',
  data: () => {
    return {
      crossSells: [
        {
          link: '/',
          image: require('~/assets/svg/manifesto/manifesto_1.svg'),
          title: 'Insert title',
          price: '¢ Price'
        },
        {
          link: '/',
          image: require('~/assets/svg/manifesto/manifesto_1.svg'),
          title: 'Second title',
          price: '€ 299.00'
        },
        {
          link: '/',
          image: require('~/assets/svg/manifesto/manifesto_1.svg'),
          title: 'Second title',
          price: '€ 299.00'
        }
      ]
    }
  }
})

</script>

<style lang="scss">
  .product__crosssells {
    margin: 0 4vw 3rem 5vw;

    .slider__container {
      position: relative;
      overflow: hidden;

      .product__crosssells--container {
        // transform: translate3d(-751.516px, 0px, 0px);
        margin-right: 13px;
        display: flex;
      }
    }
  }
</style>
