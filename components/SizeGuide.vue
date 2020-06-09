<template>
    <div :class="['size-guide', isOpen ? 'size-guide--open' : '']">
        <div class="size-guide__bg" @click="closeSizeGuide"></div>
        <div class="size-guide__content">
            <div class="size-guide__tabs size-guide__tabs--gender">
                <span class="size-guide__label" v-for="(gender, index) in sizeGuideGenders" :key="index" @click="toggleGender(gender)"
                :class="gender.isActive ? 'active' : ''">{{gender.gender}}</span>
            </div>
            <div class="size-guide__tabs size-guide__tabs--style">
                <div v-for="(gender, gIndex) in sizeGuideGenders" :key="gIndex" v-if="gender.isActive" class="size-guide__style-container">
                    <span class="size-guide__label" v-for="(style, sIndex) in gender.styles" :key="sIndex" @click="toggleStyle(gender, style)"
                    :class="style.isActive ? 'active' : ''">{{style.name}}</span>
                </div>
            </div>
            <div class="size-guide__tabs size-guide__tabs--metric">
                <div v-for="(gender, ggIndex) in sizeGuideGenders" :key="ggIndex" v-if="gender.isActive" class="size-guide__tabs-container">
                    <div v-for="(style, ssIndex) in gender.styles" :key="ssIndex" v-if="style.isActive">
                        <span class="size-guide__label" v-for="(tab, ttIndex) in style.tabs" :key="ttIndex" @click="toggleTab(style, tab)"
                        :class="tab.isActive ? 'active' : ''">{{tab.name}}</span>
                        <div v-for="(tab, ttIndex) in style.tabs" :key="ttIndex" v-if="tab.isActive" class="size-guide__table">
                            <div class="size-guide__header">
                                <span v-for="(hCell, hcIndex) in tab.header" :key="hcIndex">{{hCell}}</span>
                            </div>
                            <div class="size-guide__body">
                                <div v-for="(row, rIndex) in tab.rows" :key="rIndex" class="size-guide__row">
                                    <span v-for="(cell, cIndex) in row" :key="cIndex">{{cell}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="close-button" @click="closeSizeGuide">+</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import SizeGuidesData from '~/assets/json/size_guides.json'

export default Vue.extend({
  name: 'SizeGuide',
  data() {
    return {
        sizeGuideGenders: SizeGuidesData
    }
  },
  props: {
    isOpen: Boolean
  },
  methods: {
    toggleGender(gender) {
        this.sizeGuideGenders = this.sizeGuideGenders.map((a) => {
            a.isActive = false
            return a
        })
        gender.isActive = true
    },
    toggleStyle(gender, style) {
        gender.styles = gender.styles.map((a) => {
            a.isActive = false
            return a
        })
        style.isActive = true
    },
    toggleTab(style, tab) {
        style.tabs = style.tabs.map((a) => {
            a.isActive = false
            return a
        })
        tab.isActive = true
    },
    closeSizeGuide() {
        this.$emit('closeSizeGuide')
    }
  }
})

</script>

<style lang="scss" scoped>
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.size-guide {
    align-items: center;
    bottom: 100vh;
    display: flex;
    height: 100vh;
    justify-content: center;
    pointer-events: none;
    position: fixed;
    width: 100vw;
    left: 0;

    &.size-guide--open {
        bottom: 0;
        pointer-events: auto;
    }

    .size-guide__content {
        background: #fff;
        height: 100vh;
        padding: 0 map-get($mobile, 'sidePadding');
        position: relative;
        width: 100vw;

        @include screenSizesMin('tabletPortrait') {
            height: 85vh;
            width: 85vw;
        }
    }

    .size-guide__bg {
        background: rgba(0, 0, 0, 0.3);
        height: 100vh;
        left: 0;
        position: absolute;
        top: 0;
        width: 100vw;
    }
}

.size-guide__tabs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    text-align: left;
}

.size-guide__tabs--gender {
    margin-top: map-get($mobile, 'sidePadding');

    .size-guide__label {
        padding-top: 0;
    }
}

.size-guide__tabs-container {
    flex-grow: 1;
}

.size-guide__style-container {
    display: flex;
    flex-wrap: wrap;
}

.size-guide__label {
    cursor: pointer;
    margin-right: 10px;
    padding-top: 10px;

    &.active {
        border-bottom: 2px solid map-get($colors, 'black');
        font-weight: bold;
    }
}

.size-guide__table {
    display: flex;
    flex-direction: column;
    font-size: 9px;
    margin-top: 20px;

    @include screenSizesMin('tabletPortrait') {
        font-size: 13px;
    }

    .size-guide__body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .size-guide__header {
        border-bottom: 2px solid map-get($colors, 'black');
        font-weight: bold;

        span {
            padding-bottom: 5px;
        }
    }

    .size-guide__row, .size-guide__header {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        margin: 5px 0;

        span {
            flex-grow: 1;
            text-align: left;
        }

        & >:first-child {
            min-width: 15%;
            max-width: 15%;
        }
    }
}

.close-button {
    font-size: 33px;
    font-weight: bold;
    position: absolute;
    right: map-get($mobile, 'sidePadding');
    top: 20px;
    transform: rotate(45deg);
    cursor: pointer;
}
</style>
