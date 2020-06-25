<template>
<div class="product__container">
  <div class="product__above">
    <ProductSlideshow :isSingleProduct="isSingleProduct" :productIllustration="productIllustration" :shouldShowImages="shouldShowImages" @showImages="showImages()" :highResCost="highResCost" :lowResCost="lowResCost" :mainProduct="mainProduct" :bundleData="bundleData" :products="products" :switchId="switchId"/>
    <!-- Sticky bar -->
    <div class="product__sticky">
      <div class="product__sticky-top">
        <div class="product__sticky-top-left">
          <h6 class="product__sticky-title">{{ mainProduct.title }}</h6>
          <p class="product__sticky-price">
            {{ parseInt(mainProduct.priceRange.minVariantPrice.amount) }}
            {{ mainProduct.priceRange.minVariantPrice.currencyCode }}
          </p>
        </div>
        <div class="product__sticky-top-right" v-if="isSingleProduct">
          <div class="product__sticky-size">{{ products[0].chosenSize }}</div>
          <div :class="
              'product__sticky-color variant--' +
                products[0].chosenColor
                  .toLowerCase()
                  .split(' ')
                  .join('')
            ">
            <span></span>
          </div>
        </div>
      </div>
      <div class="product__sticky-bottom">
        <div class="product__sticky--buttons">
          <div class="product__main--quantity">
            <span class="product__main--decrement" @click="
                quantity =
                  parseInt(quantity) > 1
                    ? parseInt(quantity) - 1
                    : parseInt(quantity)
              ">-</span>
            <input class="product__main--quant-picker" type="number" name="quantity" v-model="quantity" min="1" />
            <span class="product__main--increment" @click="quantity = parseInt(quantity) + 1">+</span>
          </div>
          <button class="product__main--add-to-cart" name="add-to-cart" @click="addToCart()">{{addMessage}}</button>
        </div>
      </div>
    </div>
    <div class="">
      <section class="product__main">
        <productSelect v-for="(prod, index) in products" v-if="prod.switchId == 0 || prod.switchId == switchId || prod.switchId === undefined" :key="index" :propsIdx="index" :propsProduct="prod" :propsUpSells="upSells" :isSingleProd="isSingleProduct" :addMessage="addMessage"
        :mainProduct="mainProduct" :contentfulData="contentfulData" @sizeClicked="onSizeChosen" @colorClicked="onColorChosen" @switched="switchId = switchId == 1 ? 2 : 1" @addToCartFromChild="addToCart()" @productToggled="toggleProduct" @sizeGuideOpened="isSizeGuideOpen = true"/>
      </section>

      <SizeGuide :isOpen="isSizeGuideOpen" @closeSizeGuide="isSizeGuideOpen = false" />
    </div>
  </div>

  <!-- Disabled for now until we can merge the fix -->
  <section class="product__content-block text--left" :class="{ hidden: contentfulData.hidden }" :style="{ backgroundColor: contentfulData.bgColor }">
    <div class="content-block__text">
        <h3 class="content-block__title"><span v-html="contentfulData.title"></span></h3>
        <h6 class="content-block__desc"><span v-html="contentfulData.desc"></span></h6>
      </div>
  </section>
</div>
</template>

<script>
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
import ProductSelect from '~/components/Product/ProductSelect.vue'
import ProductSlideshow from '~/components/Product/ProductSlideshow.vue'
import SizeGuide from "~/components/SizeGuide.vue";
import { createClient } from "~/plugins/contentful.js";


export default Vue.extend({
  data() {
    return {
      quantity: 1,
      isAdding: false,
      incomplete: true,
      switchId: 1,
      shouldShowImages: false,
      bundleIllustrations: 0,
      isSizeGuideOpen: false,
      sizeOOS: false
    };
  },
  components: {
    ProductSelect,
    SizeGuide,
    ProductSlideshow
  },
  async asyncData({
    app,
    params,
    env
  }) {
     //------------------ Contentful fetching
    const contentfulClient = createClient();
    let contentfulData = {
      hidden: true,
      title: "",
      oneLiner: null,
      desc: "",
      bgColor: "",
      textColor: "#FFFFFF",
      image: ""
    };
      async function fetchContentfulData(handle) {
        try {
          let entryData = await contentfulClient.getEntries({
          content_type: env.CTF_PRODUCT_TYPE_ID,
          "fields.url": handle
          })
      if (entryData.items.length > 0) {
          let entry = entryData.items.shift();
          // if a required field is missing, hide content block section
          if (
            entry.fields.contentBlockImage ||
            entry.fields.contentBlockBgColor ||
            entry.fields.contentBlockText
          ) {
            contentfulData.hidden = false;
            contentfulData.title = entry.fields.contentBlockText.fields.title;
            contentfulData.desc =
              entry.fields.contentBlockText.fields.paragraph;
            contentfulData.bgColor = entry.fields.contentBlockBgColor;
            contentfulData.image =
              entry.fields.contentBlockImage.fields.file.url;
            // add text color if specified, else - white text
            if (entry.fields.contentBlockTextColor) {
              contentfulData.textColor = entry.fields.contentBlockTextColor;
            }
          }
          // add one-liner description
          if (entry.fields.oneLinerDescription) {
            contentfulData.oneLiner = entry.fields.oneLinerDescription;
          }
        }
        } catch (err){
          console.error(err)
        }


      }

      fetchContentfulData(params.handle)

    //------------------ Contentful fetching
    try {
      if (app && app.apolloProvider) {
        await app.store.dispatch("fetchCarbonIntensity");
        // Use hi-res images on very low carbon intensity
        let imageScale =
          app.store.state.carbonIntensity.intensity.index === "very low" ?
          2 :
          1;

        let client = app.apolloProvider.clients[params.locale];
        let result = await client.query({
          query: gql `
            query {
              productByHandle(handle: "${params.handle}") {
                title,
                id,
                handle,
                description,
                priceRange {
                  minVariantPrice {
                    amount,
                    currencyCode
                  }
                },
                tags,
                options {
                  name,
                  values
                }
                images(first: 10) {
                  edges {
                    node {
                      transformedSrc(maxWidth: 390, maxHeight: 390, crop: CENTER, scale: ${imageScale})
                    }
                  }
                },
                variants(first: 50) {
                  edges {
                    node {
                      selectedOptions {
                        name,
                        value
                      },
                      id,
                      title,
                      availableForSale,
                      compareAtPrice
                    }
                  }
                }
              }
            }
          `
        });
        let product = result.data.productByHandle;
        console.log(product)
        let bundleTag = "";
        let isSingleProduct = result.data.productByHandle.tags.some(tag => {
          let isBundleTag = tag.includes("combo") || tag.includes("quant");
          if (isBundleTag) {
            if (tag.split("-").length > 2) {
              return true;
            } else {
              bundleTag = tag;
            }
          }
          return false;
        });
        let newData = {
          mainProduct: product,
          products: [],
          isSingleProduct: isSingleProduct,
          bundleData:{}
        };

        if (isSingleProduct) {
          newData.products = prepProducts([product]);

          let bundleTags = [];
          for (let tag of product.tags) {
            if (
              (tag.includes("combo") || tag.includes("quant")) &&
              tag.length > 5
            ) {
              let parsedTag = tag.split("-").splice(0, 2);
              parsedTag = parsedTag.join("-");
              bundleTags.push(`tag:'${parsedTag}'`);
            }
          }

          let bundleTagsStr = bundleTags.join(" OR ");
          let upSellsResult = await client.query({
            query: gql `{
              products(query: "${bundleTagsStr} AND (NOT tag:'combo' OR NOT tag:'quant')", first: 15) {
                edges {
                  node {
                    title,
                    handle,
                    description,
                    variants(first: 1) {
                      edges {
                        node {
                          priceV2 {
                            amount,
                            currencyCode
                          }
                          compareAtPriceV2 {
                            amount,
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`
          });

          // Sometimes query returns mainProduct as well. Filter that out.
          newData.upSells = upSellsResult.data.products.edges.filter(a => {
            return a.node.title !== newData.mainProduct.title;
          });

          // Lazy load of the illustrations for each upSell
          try {
            newData.upSells.forEach(upSell => {
              // Handle unisex products not having separate illustrations
              if (upSell.node.description.split("|").length > 2) {
                if (upSell.node.description.split("|")[1] === "complete") {
                  upSell.node.completeBundle = true;
                  upSell.node.quantity = null;
                } else if (upSell.node.description.split("|")[1] === "null") {
                  upSell.node.quantity = null;
                } else {
                  // Case for quant bundles
                  upSell.node.quantity = parseInt(upSell.node.description.split("|")[1]);
                }
              } else {
                upSell.node.quantity = null;
              }

              // Getting the svg filenames to load bundle illustrations
              let illuHandles = [];
              if (upSell.node.completeBundle) {
                illuHandles = upSell.node.description
                  .split("|")[0]
                  .split("---")
                  .slice(0, 3);
              } else {
                illuHandles = upSell.node.description
                  .split("|")[0]
                  .split("---")
                  .slice(0, 2);
              }

              illuHandles.forEach(handle => {
                if (
                  handle.includes("accessories") ||
                  handle.includes("socks")
                ) {
                  handle = handle.replace(/womens-/g, "").replace(/mens-/g, "");
                }
              });

              // ---------------- LAZY LOADING PHASE FOR BUNDLES
              const functionWithPromise = handle => {
                try {
                  return import("~/assets/svg/products/" + handle + ".svg?raw");
                } catch (err) {
                  console.error(err);
                  return null;
                }
              };

              const anAsyncFunction = async handle => {
                const result = functionWithPromise(handle);
                return result;
              };

              const getIllustrations = async () => {
                return Promise.all(
                  illuHandles.map(handle => {
                    return anAsyncFunction(handle);
                  })
                );
              };

              getIllustrations().then(data => {
                upSell.node.bundleIllustrations = data.map(
                  illu => illu.default
                );
                upSell.node.productIllustration =
                  upSell.node.bundleIllustrations[0];
                // ----------------- LAZY LOADING PHASE FOR BUNDLES
              });
            });
          } catch (err) {
            console.error(err);
          }
          // Get rid of single products that may creep in via bad GraphQL search query
          newData.upSells = newData.upSells.filter((a) => {
            return !a.node.description.includes('///')
          })
        } else {
          let bundleResult = await client.query({
            query: gql `
              query {
                products(query: "tag:${bundleTag} AND (tag:'combo' OR tag:'quant')", first: 5) {
                  edges {
                    node {
                      title,
                      id,
                      handle,
                      description,
                      priceRange {
                        minVariantPrice {
                          amount,
                          currencyCode
                        }
                      },
                      tags,
                      options {
                        name,
                        values
                      }
                      variants(first: 50) {
                        edges {
                          node {
                            selectedOptions {
                              name,
                              value
                            },
                            id,
                            availableForSale
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          });
          let bundleProducts = bundleResult.data.products.edges;
          // Remove Gift boxes

          // Can we apply a filter method instead ??
          let giftboxIndex = bundleProducts.findIndex(a => {
            if (a.node.title === "Gift Box") return true;
          });
          if (giftboxIndex > -1) bundleProducts.splice(giftboxIndex, 1);

          // Sometimes query returns mainProduct as well. Filter that out.
          const cleanedBundleProducts = bundleProducts.filter(product => {
            return product.node.title !== newData.mainProduct.title;
          });

          newData.bundleData = {
            tag: bundleTag,
            name: product.title,
            type: bundleTag.split("-")[0],
            quantProducts: 0
          };
          newData.products = prepProducts(
            cleanedBundleProducts,
            newData.bundleData
          );
        }

        //  LOADING SVGS BASED ON IF THEY ARE SINGLE PRODUCTS OR BUNDLES

        if (isSingleProduct) {
          let illuHandle = params.handle;
          if (
            illuHandle.includes("accessories") ||
            illuHandle.includes("socks")
          ) {
            illuHandle = illuHandle
              .replace(/womens-/g, "")
              .replace(/mens-/g, "");
          }

          try {
            let productSvg = await import(
              "~/assets/svg/products/" + illuHandle + ".svg?raw"
            );

            if (productSvg.default) {
              newData.productIllustration = productSvg.default;
            } else newData.productIllustration = "";
          } catch (err) {
            console.error(err);
            newData.productIllustration = "";
          }
        } else {
          await newData.products.forEach(product => {
            let {
              handle
            } = product;
            if (handle.includes("accessories") || handle.includes("socks")) {
              handle = handle.replace(/womens-/g, "").replace(/mens-/g, "");
            }

            // ----------------- LAZY LOADING PHASE FOR BUNDLES
            const functionWithPromise = handle => {
              try {
                return import("~/assets/svg/products/" + handle + ".svg?raw");
              } catch (err) {
                console.error(err);
                return null;
              }
            };

            const getIllustration = async handle => {
              const result = await functionWithPromise(handle);
              product.illustration = result.default;
              newData.productIllustration = product.illustration;
              return result.default;
            };

            getIllustration(handle);
            // ----------------- LAZY LOADING PHASE FOR BUNDLES
          });
        }

        newData.upSells = newData.upSells ? newData.upSells : [];
        newData.contentfulData = contentfulData;

        return newData;
      } else {
        return {
          mainProduct: {
            images: {
              edges: [{
                node: {
                  transformedSrc: ""
                }
              }]
            },
            title: "",
            productIllustration: "",
            priceRange: {
              minVariantPrice: {
                amount: "",
                currencyCode: ""
              }
            }
          },
          upSells: [],
          products: [],
          isSingleProduct: true,
          bundleData: {
            tag: "",
            name: ""
          }
        };
      }
    } catch (err) {
      console.error(err);
      return {
        mainProduct: {
          images: {
            edges: [{
              node: {
                transformedSrc: ""
              }
            }]
          },
          title: "",
          productIllustration: "",
          priceRange: {
            minVariantPrice: {
              amount: "",
              currencyCode: ""
            }
          }
        },
        upSells: [],
        products: [],
        isSingleProduct: true,
        bundleData: {
          tag: "",
          name: ""
        }
      };
    }
  },
  computed: {
    addMessage() {
      if (this.isAdding) return "Adding...";
      else if (this.incomplete) return "Select color and size";
      else if (this.sizeOOS) return "Size is out of stock"
      else return "Add to cart";
    },
    // g CO2 per byte: 0,000002318
    // Avg per low image: 6,5 kb => 6656 bytes
    // Avg per high image: 22 kb => 22528 bytes
    highResCost() {
      const co2PerHighImage = 0.05;
      if (this.mainProduct)
        return this.mainProduct.images.edges.length * co2PerHighImage;
      else return co2PerHighImage;
    },
    lowResCost() {
      const co2PerLowImage = 0.015;
      if (this.mainProduct)
        return this.mainProduct.images.edges.length * co2PerLowImage;
      else return co2PerLowImage;
    }
  },
  methods: {
    openCart() {
      this.$emit("openCartFromHandle");
    },

    async addToCart() {
      this.isAdding = true;
      let cartIds = this.$store.getters.cartIds;

      this.$parent.$emit("openCartFromNuxtChild");

      let customAttributes = [];
      if (this.bundleData && this.bundleData.tag && this.bundleData.name) {
        customAttributes = [{
            key: "_bundle_id",
            value: this.bundleData.tag
          },
          {
            key: "Bundle",
            value: this.bundleData.name
          }
        ];
      }

      if(this.incomplete || this.sizeOOS) {
        this.isAdding = false
      }
      else {
        for (let prod of this.products) {
          // If the product has a switchId, and it's not the active one, skip loop
          if (
            prod.switchId != 0 &&
            prod.switchId != this.switchId &&
            prod.switchId !== undefined
          )
            continue;

          // If this id is already in the cart, increase the quantity of it before sending to Shopify
          cartIds = cartIds.map(a => {
            if (
              a.variantId === prod.chosenId &&
              JSON.stringify(a.customAttributes) ==
              JSON.stringify(customAttributes)
            ) {
              a.quantity += parseInt(this.quantity);
              return a;
            } else {
              return a;
            }
          });

          // If this id is not in the cart, add it to the cartIds that are sent to Shopify
          if (
            !cartIds.some(a => {
              return (
                a.variantId === prod.chosenId &&
                JSON.stringify(a.customAttributes) ==
                JSON.stringify(customAttributes)
              );
            })
          ) {
            let newCartId = {
              variantId: prod.chosenId,
              quantity: parseInt(this.quantity)
            };
            if (this.bundleData && this.bundleData.tag && this.bundleData.name) {
              newCartId.customAttributes = customAttributes;
            }
            cartIds = [...cartIds, ...[newCartId]];
          }
        }

        let result = await this.$apollo.mutate({
          mutation: gql `
            mutation(
              $checkoutId: ID!
              $lineItems: [CheckoutLineItemInput!]!
              $checkoutAttributes: CheckoutAttributesUpdateV2Input!
            ) {
              checkoutLineItemsReplace(
                checkoutId: $checkoutId
                lineItems: $lineItems
              ) {
                userErrors {
                  message
                  field
                }
                checkout {
                  id
                }
              }

              checkoutAttributesUpdateV2(
                checkoutId: $checkoutId
                input: $checkoutAttributes
              ) {
                checkoutUserErrors {
                  message
                  field
                }
                checkout {
                  id
                }
              }
            }
          `,
          variables: {
            checkoutId: this.$store.state.checkoutId,
            lineItems: cartIds,
            checkoutAttributes: {
              customAttributes: [{
                key: "isLowImpactWebsite",
                value: "true"
              }]
            }
          }
        });
        this.isAdding = false;
        this.$store.dispatch("fetchCart");
      }
    },

    showImages() {
      // Only show images if intensity is lower than high
      this.shouldShowImages =
        this.$store.state.carbonIntensity.intensity.index === "high" ?
        false :
        true;
    },

    updateChosenId(idx) {
      for (let i = 0; i < this.products.length; i++) {
        if (i === idx) {
          let versionOpt = this.products[i].options.find(a => {
            return a.name === 'Variant'
          })

          let chosenVariant
          let variantVersions = this.products[i].variants.edges.filter(a => {
            let colorOpt = a.node.selectedOptions.find(b => {
              return b.name === 'Color'
            })
            let sizeOpt = a.node.selectedOptions.find(b => {
              return b.name === 'Size'
            })

            return (
              this.products[i].chosenColor === colorOpt.value &&
              this.products[i].chosenSize === sizeOpt.value
            )
          })

          for(let j = 0; j < variantVersions.length; j++) {
            if(variantVersions[j].node.availableForSale) chosenVariant = variantVersions[j]
          }

          if (chosenVariant) {
            this.products = this.products.map((a, index) => {
              if (index === idx) {
                a.chosenId = chosenVariant.node.id
              }
              return a
            });
            this.products[i].isProdOpen = false
            if (this.products[i + 1]) {
              this.products[i + 1].isProdOpen = true
            }
            this.sizeOOS = false
          }
          else {
            this.sizeOOS = true
          }
        }
      }

      this.incomplete = !this.products.some((a) => {
        if(a.chosenId) return true
        else return false
      })
    },

    onSizeChosen(data) {
      this.products = this.products.map((a, i) => {
        if (i === data.idx) {
          a.chosenSize = data.size;
        }
        return a;
      });
      this.updateChosenId(data.idx);
    },

    onColorChosen(data) {
      this.products = this.products.map((a, i) => {
        if (i === data.idx) {
          a.chosenColor = data.color;
        }
        return a;
      });
      this.updateChosenId(data.idx);
    },

    toggleProduct(data) {
      this.products = this.products.map((a, i) => {
        if (i === data.idx) {
          a.isProdOpen = !a.isProdOpen;
        } else {
          a.isProdOpen = false;
        }
        return a;
      });
    }
  }
});

function prepProducts(products, bundleData) {
  let productTemplate = {
    chosenColor: "",
    chosenSize: "",
    chosenId: "",
    isProdOpen: false,
    tabs: {
      desc: [],
      fitSize: [],
      materialCare: [],
      features: []
    }
  };

  let quantProducts = [];

  for (let i = 0; i < products.length; i++) {
    if (products[i].node)
      products[i] = { ...productTemplate,
        ...products[i].node
      };
    else products[i] = { ...productTemplate,
      ...products[i]
    };

    if (products[i].variants.edges.length > 1) {
      // Preselect the first color, if there's only one to choose from
      if (
        products[i].options.find(a => a.name === "Color").values.length === 1
      ) {
        products[i].chosenColor = products[
          i
        ].variants.edges[0].node.selectedOptions.find(
          a => a.name === "Color"
        ).value;
      }
    }
    if (products[i].description.split("|").length > 1) {
      let productText = products[i].description.split("|");
      products[i].tabs.desc = productText[0].split("///");
      products[i].tabs.fitSize = productText[1].split("///");
      products[i].tabs.materialCare = productText[2].split("///");
      products[i].tabs.features = productText[3].split(",");
    }

    if (bundleData) {
      let productBundleTag = products[i].tags.find(tag => {
        return tag.includes(bundleData.tag);
      });
      products[i].switchId = parseInt(productBundleTag.split("-")[3]);

      if (productBundleTag.includes("quant")) {
        let quantCount = parseInt(productBundleTag.split("-")[4]);
        for (let j = 0; j < quantCount - 1; j++) {
          let quantProduct = JSON.parse(JSON.stringify(products[0]));
          quantProducts.push(quantProduct);
        }
      }
    }
  }

  products = products.concat(quantProducts);

  if (bundleData) {
    // Figure out which switch product corresponds to this one
    products = products.map(a => {
      if (a.switchId === 1) {
        a.switchProduct = products.find(a => {
          return a.switchId === 2;
        });
      } else if (a.switchId === 2) {
        a.switchProduct = products.find(a => {
          return a.switchId === 1;
        });
      }
      return a;
    });

    // Sort products based on their switchId. Non-switchables go first, then switchId = 1, etc.
    products.sort((a, b) => {
      if (a.switchId < b.switchId) return -1;
      else return 1;
    });

    // Add a unique key to the products
    // Since switch products share the same number in the bundle list view, we need to set this here
    let switchListIndex;
    for (let i = 0; i < products.length; i++) {
      products[i].key = i;

      if (i === 0) {
        products[i].isProdOpen = true;
      }
      if(i === products.length - 1) products[i].isLastProduct = true
      else products[i].isLastProduct = false

      if (products[i].switchId < 1) {
        products[i].listIndex = i;
      } else {
        // Set the switchListIndex to the first index found
        if (!switchListIndex) switchListIndex = i;
        products[i].listIndex = switchListIndex;

        products[i].isLastProduct = true
      }
    }
  }

  bundleData &&
    (bundleData.quantProducts = products.reduce((acc, product) => {
      return product.switchId > 1 ? acc : acc + 1;
    }, 0));

  return products;
}
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.container-carbon--high .product__image-label {
    color: map-get($colors, "carbonHigh");
}

.locale-products-handle {
    padding-top: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}

.product__above {
    display: flex;
    flex-direction: row;

    @include screenSizes(tabletPortrait) {
        flex-direction: column;
    }
}

.product__container {
    width: 100%;

    .product__slideshow {
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: hidden;
        position: sticky;
        top: 80px;
        margin-top: 80px;
        width: 50vw;
        height: calc(100vh - 80px);

        &.illustrations--active {
          overflow-x: hidden;
        }

        @include screenSizes(tabletPortrait) {
          width: 100vw;
          height: 77vh;
          top: 0;
          position: unset;
          margin-top: 0;
        }

        &.vertical {
          flex-wrap: nowrap;
          flex-direction: column;
        }
        .bundle__illustration {
          max-width: 40%;
          min-width: 90px;

          &--quant {
            position: absolute;
            width: 40%;
            height: 50%;

            &:first-child {
              top: 15%;
              left: 15%;

              @include screenSizes(phone) {
                top: 20%;
                left: 13%;
              }
            }

            &:nth-child(2) {
              @include screenSizes(phone) {
                top: 30%;
              }
            }

            &:last-child {
              top: 30%;
              right: 15%;

              @include screenSizes(phone) {
                top: 35%;
                right: 13%;
              }
            }

            &.five {
              &:first-child {
                top: 0%;
                left: 0%;

                @include screenSizes(phone) {
                  top: 8%;
                }
              }
              &:nth-child(2) {
                top: 12%;
                left: 12%;

                @include screenSizes(phone) {
                  top: 20%;
                }
              }
              &:nth-child(3) {
                top: 25%;
                left: 25%;

                @include screenSizes(phone) {
                  top: 33%;
                }
              }

              &:nth-child(4) {
                top: 37%;
                left: 37%;

                @include screenSizes(phone) {
                  top: 45%;
                }
              }
              &:last-child {
                top: 50%;
                left: 50%;

                @include screenSizes(phone) {
                  top: 58%;
                }
              }
            }
          }
        }

        .product__image-label {
          position: absolute;
          width: 50vw;
          bottom: 10%;
          display: flex;
          flex-direction: column;
          padding-left: 10px;
          padding-right: 10px;
          height: fit-content;

          @include screenSizes(tabletPortrait) {
            bottom: 27vh;
            top: auto;
            width: 100vw;
          }

          @include screenSizes(phoneSmall) {
            bottom: 20%;
          }

          .label__tap {
            display: none;

            @include screenSizes(tabletPortrait) {
              display: inline-block;
            }
          }

          .label__click {
            display: inline-block;

            @include screenSizes(tabletPortrait) {
              display: none;
            }
          }
        }

        .product__image-label--bold {
            font-weight: bold;

            .label__container {
              display: flex;
              flex-direction: column;
            }
        }

        .product__image-label--desc {
          max-width: 300px;
        }

        > div {
            align-items: center;
            background: map-get($colors, "productGrey");
            display: flex;
            justify-content: center;
            overflow: hidden;
            position: relative;
            min-width: 50vw;

            @include screenSizes(tabletPortrait) {
              min-width: 100vw;
              max-width: 100vw;
            }
        }

        svg {
            width: 50vw;
            @include screenSizes(tabletPortrait) {
              width: 100vw;
            }

            *[stroke*="#"] {
                stroke: map-get($colors, "black") !important;
                stroke-width: .3;
            }

            *[fill="#E2E2E2"] {
              fill: map-get($colors, "productGrey") !important;
            }

            *[fill*="#"] {
                fill: map-get($colors, "productGrey") !important;
            }

            // Tennis socks fix
            *[fill*="#999"] {
                fill: map-get($colors, "black") !important;
            }
        }

        img {
          width: 50vw;

          @include screenSizes(tabletPortrait) {
            width: auto;
            min-height: 100%;
          }
        }

        &.bundle {
            .bundle__illustrations {
                padding-bottom: 40px;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                height: calc(100vh - 80px);
                width: 50vw;

                @include screenSizes(tabletPortrait) {
                  min-height: 50vh;
                  max-height: 100%;
                  width: 100%;
                }

                &.vertical {
                    flex-direction: column;
                }
                .bundle__illustration {
                    max-width: 45%;
                    min-width: 90px;
                }
                .product__image-quant {
                    top: 25px;
                    position: absolute;
                    width: 100vw;
                }
                svg {
                    width: 100%;
                }
            }
            .product__image-quant {
                bottom: 25%;
                right: 20%;
                position: absolute;
                border: 1.5px solid map-get($colors, "black");
                border-radius: 50%;
                height: 26.5px;
                width: 26.5px;
                font-size: 17px;
                .product__bundle--quant {
                    font-size: 0.9rem;
                    color: white;
                }
            }
        }
    }

    .product__sticky {
        color: map-get($colors, 'black');
        background: #fff;
        border-top: 1px solid #a1a4a9;
        bottom: 0;
        left: 0;
        position: fixed;
        transition: transform 0.3s ease-in-out;
        transition: transform 0.3s ease-in-out,-webkit-transform 0.3s ease-in-out;
        width: 100vw;
        display: none;

        @include screenSizes(tabletPortrait) {
            display: block;
        }

        .product__sticky-top {
            display: flex;
            height: 4rem;
            justify-content: space-between;
            padding: 1rem;
            align-items: center;

            .product__sticky-top-left {
              display: flex;
              align-items: center;
              flex-direction: row;
            }

            .product__sticky-top-right {
              display: flex;
              flex-direction: row;
              align-items: center;

              .product__sticky-color {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                margin-left: 5px;
              }
            }

            .product__main--quantity {
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              flex-basis: 50%;
              border-top: 1px solid map-get($colors, "brand");
              height: 3.6rem;

              .product__main--decrement,
              .product__main--increment {
                align-items: center;
                bottom: 0;
                color: map-get($colors, "black");
                cursor: pointer;
                display: inline-flex;
                font-size: 19px;
                justify-content: center;
                position: absolute;
                top: 0;
                width: 40px;
              }
            }

            .product__sticky-title {
              margin-right: 10px;
              text-align: left;
            }

            .product__sticky-price {
                color: map-get($colors, 'brand');
            }

            .product__main--quant-picker {
                border: none;
                color: map-get($colors, "black");
                height: 100%;
                text-align: center;
                font-size: 13px;
            }

            .product__main--add-to-cart {
                flex-basis: 50%;
                border: 1px solid map-get($colors, "black");
            }
        }

        .product__sticky-bottom {
            .product__sticky--buttons {
                margin-bottom: 0;
                display: flex;
                justify-content: space-between;

                .product__main--quantity {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    flex-basis: 50%;
                    border-top: 1px solid map-get($colors, 'brand');
                    height: 3.6rem;

                    .product__main--decrement,
                    .product__main--increment {
                        color: map-get($colors, 'black');
                        width: 40px;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 40px;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 19px;
                    }

                    .product__main--increment {
                        right: 0;
                        left: auto;
                    }

                    .product__main--decrement {
                        left: 0;
                    }

                    .product__main--quant-picker {
                        border: none;
                        color: map-get($colors, 'black');
                        height: 100%;
                        text-align: center;
                        font-size: 13px;
                    }
                }

                .product__main--add-to-cart {
                    flex-basis: 50%;
                    border: none;
                }
            }
        }
    }

    .product__main--add-to-cart {
        height: 3.6rem;
        text-align: center;
        background: map-get($colors, "black");
        color: white;
        cursor: pointer;
        font-size: 13px;
        border: none;
    }

    .product__main--extra {
        margin-bottom: 2rem;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 13px;
        text-align: left;

        .product__main--sizeguide {
            cursor: pointer;
        }

        .product__main--shipping {
            flex-basis: 75%;
            padding-right: 5px;
            color: map-get($colors, "brand");
        }

        .size-guide-cta {
          display: inline-block;
          position: relative;

          &::after {
            background: map-get($colors, 'black');
            bottom: 0;
            content: '';
            height: 1px;
            left: 0;
            position: absolute;
            width: 100%;
          }
          &:hover::after {
            bottom: -1px;
            height: 2px;
          }
        }
    }

    .product__content-block {
        background: rgb(167, 143, 122);
        height: 100%;
        padding:0px;
        color: #fff;
        width: 100%;
        display: flex;
        &.hidden {
          display: none;
        }

        @include screenSizes(tabletPortrait) {
            padding: 0px;
            flex-direction: column;
        }

        .content-block__text {
          padding: 12vw 30px;
          display: flex;
          flex:1;

          @include screenSizes(tabletPortrait) {
            width: 100%;
            flex-direction: column;
            justify-content: space-around;
            height: auto;
          }

        .content-block__title {
          width: 50%;
          color: #fff;
          font-size: 26px;
          margin:0 0 20px;

          @include screenSizes(tabletPortrait) {
            width: 95%;
          }
      }

      .content-block__desc {
        font-size: 16px;
        max-width: 350px;
        color: #fff;

        @include screenSizes(tabletPortrait) {
          margin-top: 20px;
        }
      }
    }
    .content-block__image {
      width: 50%;

      @include screenSizes(tabletPortrait) {
        width: 100%;
      }

      img {
        width: 100%;
        @include screenSizes(tabletPortrait) {
          width: 100%;
        }
      }

    }
  }


.product__main--add-to-cart {
  font-family: 'Circular';
}

.footer__container {
  @include screenSizes(tabletPortrait) {
    margin-bottom: 100px;
  }
}
}
</style>
