<template>
  <div class="product__upsells text--left" v-if="propsUpSells.length > 0">
    <h4 class="product__upsells--title">Save with packs</h4>
    <nuxt-link :to="`/${$store.state.activeCurrency}/products/${upSell.node.handle}`" v-for="(upSell, index) in propsUpSells" :key="index">
      <div class="product__upsells--bundle">
        <div class="product__upsells--left">
          <div class="product__illustration" v-for="illu in upSell.node.bundleIllustrations" v-html="illu"></div>
          <span class="product__image-quant variant--black" v-if="upSell.node.quantity">
            <span class="product__bundle--quant">
              x{{ upSell.node.quantity }}
            </span>
          </span>
        </div>
        <div class="product__upsells--right">
          <div class="product__upsells--right-left">
            <h6 class="product__upsells--product-title">
              {{ upSell.node.title }}
            </h6>
            <div>
              <div class="product__upsells--prices">
                <span class="product__upsells--price">
                  {{
                  formatPrice(
                  upSell.node.variants.edges[0].node.priceV2.amount,
                  upSell.node.variants.edges[0].node.priceV2.currencyCode
                  )
                  }}
                </span>
                <span class="product__upsells--price-compare" v-if="
                    upSell.node.variants.edges[0].node.compareAtPriceV2 !==
                      null
                  ">
                  {{
                  formatPrice(
                  upSell.node.variants.edges[0].node.compareAtPriceV2
                  .amount,
                  upSell.node.variants.edges[0].node.compareAtPriceV2
                  .currencyCode
                  )
                  }}
                </span>
              </div>
              <span class="product__upsells--button">Upgrade</span>
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
    <div class="product__upsells--gender">
      <nuxt-link :to="`${$store.state.activeCurrency}/collections/womens-save-with-packs`" v-if="$route.params.handle.includes('womens')">
        View all Women's packs
      </nuxt-link>
      <nuxt-link :to="`${$store.state.activeCurrency}/collections/mens-save-with-packs`" v-else>
        View all Men's packs
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
</style>
