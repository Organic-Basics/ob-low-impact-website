<template>
  <div>
    <svg id="cart__icon" width="26px" height="26px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Cart</title>
        <g id="Icon:-Totebag-/-Cart-(Small-–-Gray)" stroke-width="1" fill-rule="evenodd">
            <g id="Group-4" transform="translate(3.000000, 1.000000)" stroke-width="1.5">
                <polygon id="Stroke-1" points="0 20 16 20 16 5 0 5"></polygon>
                <path d="M3,8 L3,2.13263434 C3,0.959370904 4.12107114,0 5.49177352,0 L10.5093612,0 C11.8800635,0 13,0.959370904 13,2.13263434 L13,8" id="Stroke-3"></path>
            </g>
        </g>
    </svg>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'CartIcon'
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

#cart__icon , #cart__icon path {
  stroke: map-get($colors, 'black');
  fill: none;
}

#cart__icon g {
  stroke-width: 1.3;
}
</style>
