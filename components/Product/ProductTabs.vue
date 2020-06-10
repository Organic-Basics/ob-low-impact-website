<template>
  <div class="">

  <section class="product__tabs--mobile">
    <div class="product__text product__text--feat">
      <div @click="toggleTabMobile('featOpen')" :class="{'product__tabs--title': true, 'tab--open':featOpen}">
        <h6>Features</h6>
        <h5 class="tab__plus">+</h5>
      </div>
      <ul v-if="featOpen" class="tab__feat">
        <li v-for="(f, index) in propsProduct.tabs.features">
          <div class="tab__feat--title">
            <div class="tab__feat--left" v-for="(feat) in features"
              v-if="f.toLowerCase().trim() == feat.name.toLowerCase().trim()"
              @click="toggleFeat(feat)" :class="feat.isOpen ? 'feat--open' : ''">
              <div class="">
                <img class="tab__feat--icon"
                  :src="feat.icon" :alt="feat.name" />
                {{f}}
              </div>
              <h5 class="tab__plus">+</h5>
            </div>
          </div>
          <div class="tab__feat--desc" v-for="(feat) in features"
            v-if="feat.isOpen && f.toLowerCase().trim() == feat.name.toLowerCase().trim()">
            {{feat.desc}}
          </div>
        </li>
      </ul>
    </div>
    <div class="product__text product__text--desc">
      <div @click="toggleTabMobile('descOpen')" :class="{'product__tabs--title': true, 'tab--open':descOpen}">
        <h6>Description</h6>
        <h5 class="tab__plus">+</h5>
      </div>
      <ul v-if="descOpen">
        <li v-for="(d, index) in propsProduct.tabs.desc">{{d}}</li>
      </ul>
    </div>
    <div class="product__text product__text--fit">
      <div @click="toggleTabMobile('fitOpen')" :class="{'product__tabs--title': true, 'tab--open':fitOpen}">
        <h6>Fit & Sizing</h6>
        <h5 class="tab__plus">+</h5>
      </div>
      <ul v-if="fitOpen">
        <li v-for="(fs, index) in propsProduct.tabs.fitSize">{{fs}}</li>
      </ul>
    </div>
    <div class="product__text product__text--mat">
      <div @click="toggleTabMobile('careOpen')" :class="{'product__tabs--title': true, 'tab--open':careOpen}">
        <h6>Material & Care</h6>
        <h5 class="tab__plus">+</h5>
      </div>
      <ul v-if="careOpen">
        <li v-for="(mc, index) in propsProduct.tabs.materialCare">{{mc}}</li>
      </ul>
    </div>
  </section>

  <section class="product__tabs--desktop">
      <ul class="product__main--tab-titles">
        <li class="product__main--title-feat" @click="toggleTabDesktop('featOpen')" :class="{'product__tabs--title': true, 'tab--open':featOpen}">
          <span>Features</span>
        </li>
        <li class="product__main--title-desc" @click="toggleTabDesktop('descOpen')" :class="{'product__tabs--title': true, 'tab--open':descOpen}">
          <span>Description</span>
        </li>
        <li class="product__main--title-fit" @click="toggleTabDesktop('fitOpen')" :class="{'product__tabs--title': true, 'tab--open':fitOpen}">
          <span>Fit &amp; Sizing</span>
        </li>
        <li class="product__main--title-mat" @click="toggleTabDesktop('careOpen')" :class="{'product__tabs--title': true, 'tab--open':careOpen}">
          <span>Material &amp; Care</span>
        </li>
      </ul>
      <div class="product__main--info">
        <div v-if="featOpen" class="product__main--info-feat">
          <ul v-if="featOpen" class="tab__feat">
            <li v-for="(f, index) in propsProduct.tabs.features">
              <div class="tab__feat--title">
                <div class="tab__feat--left" v-for="(feat) in features"
                  v-if="f.toLowerCase().trim() == feat.name.toLowerCase().trim()"
                  @click="toggleFeat(feat)" :class="feat.isOpen ? 'feat--open' : ''">
                  <div class="">
                    <img class="tab__feat--icon"
                      :src="feat.icon" :alt="feat.name" />
                    {{f}}
                  </div>
                  <h5 class="tab__plus">+</h5>
                </div>
              </div>
              <div class="tab__feat--desc" v-for="(feat) in features"
                v-if="feat.isOpen && f.toLowerCase().trim() == feat.name.toLowerCase().trim()">
                {{feat.desc}}
              </div>
            </li>
          </ul>
        </div>

        <div class="product__main--info-desc">
          <ul v-if="descOpen">
            <li v-for="(d, index) in propsProduct.tabs.desc">{{d}}</li>
          </ul>
        </div>

        <div class="product__main--info-fit">
          <ul v-if="fitOpen">
            <li v-for="(fs, index) in propsProduct.tabs.fitSize">{{fs}}</li>
          </ul>
        </div>

        <div class="product__main--info-mat">
            <ul v-if="careOpen">
              <li v-for="(mc, index) in propsProduct.tabs.materialCare">{{mc}}</li>
            </ul>
        </div>
    </div>
</section>
</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ProductTabs',
  props: {
    propsProduct: Object
  },
  data: () => {
    return {
      descOpen: false,
      fitOpen: false,
      careOpen: false,
      featOpen: true,
      featDescOpen: false,
      features: [
        {
          name: 'Organic',
          icon: require('~/assets/svg/feature.organic.svg'),
          desc: "We've used GOTS certified organic cotton for this product which comes from the coast of the Aegean Sea. It’s widely regarded as some of the most soft and durable cotton in the world. The GOTS standard also guarantees that the people that made this are paid living wages and treated like humans.",
          isOpen: false
        },
        {
          name: 'Ethically made',
          icon: require('~/assets/svg/feature.ethicallymade.svg'),
          desc: "Made in better working conditions with living wages, no child labor, freely chosen employment and respect for the environment. We use the GOTS and SA8000 standards to ensure that things are made fairly.",
          isOpen: false
        },
        {
          name: 'PETA "Vegan Approved"',
          icon: require('~/assets/svg/feature.peta.svg'),
          desc: 'The PETA "Vegan Approved" logo indicates that the product is cruelty-free - and that it does not contain any animal products or by-products.',
          isOpen: false
        },
        {
          name: 'TENCEL™',
          icon: require('~/assets/svg/feature.tencel.svg'),
          desc: "TENCEL™ is an eco-friendly fiber made from responsibly sourced wood pulp. The wood pulp is dissolved in a closed-loop process with a non-toxic organic solvent, then the solution is forced through tiny holes in order to create a magical biodegradable fiber that feels softer and lighter than cotton.",
          isOpen: false
        },
        {
          name: 'Soft + Breathable',
          icon: require('~/assets/svg/feature.softbreathable.svg'),
          desc: 'TENCEL™ is softer, more breathable and more absorptive than cotton because it is composed of very small fibers. The end result feels like something closer to silk than cotton - which is definitely a good thing.',
          isOpen: false
        },
        {
          name: 'Seamless',
          icon: require('~/assets/svg/feature.seamless.svg'),
          desc: 'This product is knitted in a way that creates no seams. No seams means greater comfort and durability because there are no weak points in the garment.',
          isOpen: false
        },
        {
          name: 'Polygiene® - Stays Fresh',
          icon: require('~/assets/svg/feature.polygiene.svg'),
          desc: 'Our activewear is treated with a safe, permanent, bluesign® approved recycled silver salt called Polygiene® - which stops the growth of odor causing bacteria on the fabric. Polygiene® is not a nano-silver and it has no harmful effect on the environment when washing.',
          isOpen: false
        },
        {
          name: 'Odorless',
          icon: require('~/assets/svg/feature.odorless.svg'),
          desc: "We’ve blended a silver coated polymer thread called SilverTech™ into the organic cotton to stop the growth of odor causing bacteria on the fabric. We use a very small amount of real silver, not nano-silvers for this. SilverTech™ is safe, permanent and it has no harmful effect on the environment when washing.",
          isOpen: false
        },
        {
          name: 'Heat Regulating',
          icon: require('~/assets/svg/feature.heatregulating.svg'),
          desc: "Silver is thermodynamic - which means that our SilverTech™ thread keeps you cooler when it's hot and warmer when it's cold, helping you feel fresh and stay fresh.",
          isOpen: false
        },
        {
          name: 'Recycled materials',
          icon: require('~/assets/svg/feature.recycledmaterials.svg'),
          desc: "We use recycled materials because they save water and energy. They also help divert waste from landfills and prevent CO2 - helping to keep our planet clean and combat climate change.",
          isOpen: false
        }
      ]
    }
  },
  methods: {
    toggleTabMobile(tabName) {
      let newState = !this[tabName]
      this.descOpen = false
      this.fitOpen = false
      this.careOpen = false
      this.featOpen = false
      this[tabName] = newState
    },
    toggleTabDesktop(tabName) {
      let newState = true
      this.descOpen = false
      this.fitOpen = false
      this.careOpen = false
      this.featOpen = false
      this[tabName] = newState
    },
    toggleFeat(feat) {
      let newState = !feat.isOpen
      this.features = this.features.map((a) => { a.isOpen = false; return a })
      feat.isOpen = newState
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.product__tabs--mobile {
  padding: 0;
  display: none;

  @include screenSizes(tabletPortrait) {
    display: block;
  }
}

.tab--open {
  border-bottom: 1.5px solid map-get($colors, 'black');

  .tab__plus {
    transform: rotate(45deg);
  }
}

.feat--open {
  .tab__plus {
    transform: rotate(45deg);
    transition: transform .25s ease-in-out;
  }
}

.product__text {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  .product__tabs--title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid map-get($colors, 'brand');
    padding-bottom: .5rem;

    .tab__plus {
      transition: transform .25s ease-in-out;
    }
  }

  ul {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding-left: 20px;
    margin-top: 20px;
    margin-bottom: 8px;

    li {
      list-style: disc;
      color: map-get($colors, 'brand');
      line-height: 20.8px;
      font-size: 13px;
    }
  }
}

.tab__feat {
  width: calc(100% + 20px);
  margin-left: -20px;

  .tab__feat--title {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    color: map-get($colors, 'black');

    .tab__feat--left {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;
      }
    }

    .tab__feat--icon {
      width: 30px;
      margin-right: 20px;
    }
  }

  .tab__feat--desc {
    margin-left: 50px;
    margin-bottom: 8px;
    color: map-get($colors, 'brand')
  }

  li {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    color: map-get($colors, 'black');
  }

  li:nth-child(n+2) {
    margin-top: 20px;
  }
}

.bundle__selection .product__tabs--desktop {
  margin-top: 20px;
}

.product__tabs--desktop {
  margin: 3vw 0;
  padding: 0;

  @include screenSizes(tabletPortrait) {
    display: none;
  }

  .product__tabs--title {
    padding-bottom: 5px;
  }

  .product__main--tab-titles {
    border-bottom: 1px solid map-get($colors, 'brand');
    display: flex;
    justify-content: space-between;
    margin-left: 0;
    margin-bottom: 20px;
    padding-bottom: 0;
    list-style: none;
    padding-left: 0;

    @include screenSizes(tabletPortrait) {
      padding-bottom: 2px;
    }
  }

  .product__main--info {
    font-size: 13px;

    ul {
      padding-left: 20px;
      color: map-get($colors, 'darkGrey');
    }
  }

  .tab__feat {
    margin-left: -20px;
  }
}
</style>
