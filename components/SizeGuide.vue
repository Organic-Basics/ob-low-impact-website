<template>
    <div>
        <div>
            <span v-for="(gender, index) in sizeGuideGenders" :key="index" @click="toggleGender(gender)"
            :class="gender.isActive ? 'active' : ''">{{gender.gender}}</span>
        </div>
        <div>
            <div v-for="(gender, gIndex) in sizeGuideGenders" :key="gIndex" v-if="gender.isActive">
                <span v-for="(style, sIndex) in gender.styles" :key="sIndex" @click="toggleStyle(gender, style)"
                :class="style.isActive ? 'active' : ''">{{style.name}}</span>
            </div>
        </div>
        <div>
            <div v-for="(gender, ggIndex) in sizeGuideGenders" :key="ggIndex" v-if="gender.isActive">
                <div v-for="(style, ssIndex) in gender.styles" :key="ssIndex" v-if="style.isActive">
                    <span v-for="(tab, ttIndex) in style.tabs" :key="ttIndex" @click="toggleTab(style, tab)"
                    :class="tab.isActive ? 'active' : ''">{{tab.name}}</span>
                    <table v-for="(tab, ttIndex) in style.tabs" :key="ttIndex" v-if="tab.isActive">
                        <thead>
                            <tr >
                                <th v-for="(hCell, hcIndex) in tab.header" :key="hcIndex">{{hCell}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rIndex) in tab.rows" :key="rIndex">
                                <td v-for="(cell, cIndex) in row" :key="cIndex">{{cell}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
  mounted() {
    console.log(this.sizeGuideGenders)
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
    }
  }
})

</script>

<style lang="scss" scoped>
    .active {
        color: red;
    }
</style>