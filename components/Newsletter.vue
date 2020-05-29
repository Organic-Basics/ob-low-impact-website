<template>
  <section class="newsletter">
    <img src="~/assets/svg/3_girls.svg" alt="Three models in Organic Basics underwear">
    <div class="newsletter__content text--left">
      <h3>Stay up to date on product releases, events and stories.</h3>
      <div class="button__area">
        <input type="text" name="" value="" placeholder="Enter your email address">
        <button type="button" name="button">Subscribe</button>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({

})

</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.newsletter {
  background: map-get($colors, 'brand');
  padding: 0;
  display: flex;
  flex-direction: column;

  img {
    width: 100vw;
  }

  .newsletter__content {
    padding: 30px;

    h3 {
      max-width: 530px;
      color: #fff;
      margin-bottom: 40px;
    }

    .button__area {
      display: flex;
      flex-direction: column;

      input {
        background-color: map-get($colors, 'brand');
        height: 58px;
        border: 1px solid #fff;
        margin-bottom: 20px;
        padding: 8px 0 8px 16px;
        font-size: 14px;
        font-family: 'Circular';

        &::placeholder {
          color: #fff;
        }
      }

      button {
        color: #fff;
        font-size: 16px;
        font-family: 'Circular';
        font-weight: bold;
        padding: 0 8px;
        height: 58px;
        background: map-get($colors, 'newsletterButton');
        border: 1px solid map-get($colors, 'newsletterButton');
      }
    }
  }
}
</style>
