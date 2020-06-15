<template>
<div class="page--offline">
	<header>
		<logo/>
  	<h3 class="offline-header__title">The low impact website is currently offline.</h3>
	</header>
  <div class="offline__main">
  	<ImpactMeter/>
		<h1 class="offline__text--dramatic">Offline</h1>
  	<h5 class="offline__carbon">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</h5>
		<div class="offline__desc">
			<h6>The website is currently unavailable as the server it is hosted on is running on too little renewable energy.</h6>
	  	<br>
	  	<h6>It looks like the carbon intensity will get better in <strong>{{minutesTillNext}} minutes</strong>.</h6>

			<h5><a :href="mainSiteLink">Regular store</a></h5>
		</div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import ImpactMeter from '~/components/ImpactMeter.vue'
import mainSiteMap from '~/assets/json/mainSiteMap.json'

export default Vue.extend({
  components: {
  	Logo,
  	ImpactMeter
  },
	data: () => {
    return {
      mainSiteMap: mainSiteMap
    }
  },
  computed: {
    carbonIntensity: function() {
      if(!this.$store.state.carbonIntensity.intensity) {
        return {
          index: '...',
          forecast: 0
        }
      }
      else {
        return {
          index: this.$store.state.carbonIntensity.intensity.index.replace(' ', '-'),
          forecast: this.$store.state.carbonIntensity.intensity.forecast
        }
      }
    },
    minutesTillNext: function() {
    	let now = new Date()
    	if(!this.$store.state.carbonForecast) {
    	  return '...'
    	}
    	else {
    		let timeTo = 0
    		// The first one is right now, so we skip that one
    	  for(let i = 1; i < this.$store.state.carbonForecast.length; i++) {
    	  	if(this.$store.state.carbonForecast[i].intensity.index !== 'very high') {
    	  		let properTime = new Date(this.$store.state.carbonForecast[i].from)
    	  		timeTo = ((properTime - now) / 1000 / 60).toFixed(0)
    	  		break
    	  	}
    	  }
    	  return timeTo
    	}
    },
		mainSiteLink: function() {
      let mainSiteData = this.mainSiteMap.mainSiteMap
      let mainSite = mainSiteData.find((a) => {
        return a.currency == this.$store.state.activeCurrency
      })
      if(mainSite) {
        let mainSiteUrl = 'https://' + mainSite.url
        return mainSiteUrl
      }
      else {
        return
      }
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";
@import "~assets/scss/mixins.scss";

.page--offline {
	align-items: center;
	display: flex;
	flex-direction: column;

	header {
		max-width: 90vw;
		display: flex;
    flex-direction: column;
    align-items: center;

		.logo {
			top: 20px;
			position: absolute;
		}

		.offline-header__title {
			margin: 5vh auto;
			color: map-get($colors, 'carbonHigh');
			font-size: 26px;
		}
	}

	.spedometer__container {
		margin-top: 40px;

		#speedometer {
			width: 30vw;
			max-width: 100%;

			@include screenSizes(phone) {
				width: 75vw;
			}
		}

		span {
			display: none;

			@include screenSizes(phone) {
				display: unset;
			}
		}
	}

	.offline__main {
		align-items: center;
    justify-content: center;
    flex-direction: column;
		display: flex;

		svg, p {
			padding: 0 map-get($mobile, "sidePadding");
		}

		.offline__text--dramatic {
			-webkit-text-stroke: 1px map-get($colors, 'carbonHigh');
			-webkit-text-fill-color: transparent;
	    margin: auto;
	    position: absolute;
			margin-top: -110px;
    	font-size: 8vw;

			@include screenSizes(tabletPortrait) {
				font-size: 17vw;
			}

      @include screenSizes(phone) {
        // margin-top: -140px;
        // font-size: 25vw;
        // max-width: 90vw;
				display: none;
      }

			// @include screenSizes(phoneSmall) {
      //     margin-top: -175px;
      // }
		}

		.offline__carbon {
			color: map-get($colors, 'carbonHigh');
			margin-bottom: 35px;
		}

		.offline__desc {
			max-width: 45vw;
			max-width: 500px;

			h5 {
				font-weight: bold;
				border-bottom: 2px solid black;
				width: fit-content;
				margin: 40px auto;
			}

			@include screenSizes(tabletPortrait) {
				max-width: 80vw;
				padding: 0 20px;
			}

			@include screenSizes(phone) {
				max-width: 100%;
			}
		}
	}
}
</style>
