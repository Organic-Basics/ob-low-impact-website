<template>
<div class="page--offline">
	<header>
		<logo/>
  	<h3 class="offline__carbon">The low impact website is currently offline.</h3>
	</header>
  <div class="offline__main">
  	<ImpactMeter/>
  	<h5 class="offline__carbon">Carbon intensity: {{carbonIntensity.forecast}}g CO2/kWh</h5>
  	<p>The website is currently unavailable as the server it is hosted on is running on too little renewable energy.</p>
  	<br>
  	<p>It looks like the carbon intensity will get better in <strong>{{minutesTillNext}} minutes</strong>.</p>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import ImpactMeter from '~/components/ImpactMeter.vue'

export default Vue.extend({
  components: {
  	Logo,
  	ImpactMeter
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
    }
  }
})
</script>

<style lang="scss">
@import "~assets/scss/variables.scss";

.page--offline {
	align-items: center;
	display: flex;
	flex-direction: column;

	header {
		max-width: 90vw;
	}

	.offline__main {
		padding-top: 30px;

		svg {
			padding: 0 map-get($mobile, "sidePadding");
		}
	}

	h3 {
		padding: 0 10px;
		margin-top: 25px;
	}

	h5 {
		margin-bottom: 40px;
	}

	p {
		padding: 0 map-get($mobile, "sidePadding");
	}

	.offline__carbon {
		color: map-get($colors, 'carbonHigh');
	}
}
</style>
