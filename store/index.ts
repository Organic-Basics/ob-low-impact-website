import { GetterTree, ActionTree, MutationTree } from 'vuex'
import gql from 'graphql-tag'
import axios from 'axios'

// init Vuex state object
export const state = () => ({
  checkoutId: '',
  cart: {},
  carbonIntensity: {},
  carbonForecast: [],
  activeCurrency: 'eur',
  cookieConsent: [
    {
      'type': 'necessary',
      'consent': true
    },
    {
      'type': 'statistics',
      'consent': false
    },
    {
      'type': 'marketing',
      'consent': false
    },
    {
      'type': 'preferences',
      'consent': false
    }
  ]
})

export type RootState = ReturnType<typeof state>

// provide Vuex getters
export const getters: GetterTree<RootState, RootState> = {
	cartIds: (state:any):any => {
    let cartIds:any[] = []
    if(state.cart.lineItems) {
      state.cart.lineItems.edges.forEach((a:any) => {
        cartIds.push({
          variantId: a.node.variant.id,
          quantity: a.node.quantity,
          customAttributes: a.node.customAttributes.map((attr:any) => ({key: attr.key, value: attr.value}))
        })
      })
    }
    return cartIds
  }
}

// provide Vuex mutations
export const mutations: MutationTree<RootState> = {
  // access the state object with state.checkoutId
  setCheckoutId: (state, newId:string) => (state.checkoutId = newId),
  setActiveCurrency: (state, currency:string) => (state.activeCurrency = currency),
  saveCart: (state, cart:any) => (state.cart = cart),
  setCarbonIntensity: (state, intensity:any) => (state.carbonIntensity = intensity),
  setCarbonForecast: (state, forecast:any) => (state.carbonForecast = forecast),
  updateCookieConsent: (state, newState:any) => (state.cookieConsent = newState)
}

// register a Vuex action
export const actions: ActionTree<RootState, RootState> = {
  async fetchCart (store:any) {
  	let client:any
  	if(this && this.app && this.app.apolloProvider && this.app.apolloProvider.defaultClient) {
      	client = this.app.apolloProvider.defaultClient
    }
    if(client) {
	  	let result = await client.query({
	      query: gql`
	        query ($checkoutId: ID!) {
	          node(id: $checkoutId) {
	            ... on Checkout {
	              webUrl
                orderStatusUrl
                lineItemsSubtotalPrice {
                  amount
                  currencyCode
                }
	              totalTax
	              totalPriceV2 {
                  amount
                  currencyCode
                }
	              lineItems (first:20) {
	                edges {
	                  node {
	                    title
	                    variant {
	                      title
                        id
                        product {
                          handle
                        }
	                      image {
	                        src
	                      }
	                      priceV2 {
                          amount
                          currencyCode
                        }
	                    }
	                    quantity
                      customAttributes {
                        key
                        value
                      }
                      discountAllocations {
                        allocatedAmount {
                          amount
                          currencyCode
                        }
                      }
	                  }
	                }
	              }
	            }
	          }
	        }
	      `,
	      variables: {
            // access state object
	        checkoutId: store.state.checkoutId
	      },
	      fetchPolicy: 'network-only'
			})
      let cartData = result.data.node
      for(let i = 0; i < cartData.lineItems.edges.length; i++) {
        let productSvg = await import('~/assets/svg/products/' + cartData.lineItems.edges[i].node.variant.product.handle + '.svg?raw')
        cartData.lineItems.edges[i].node.illustration = productSvg.default
      }

      // trigger a change with store.commit
			store.commit('saveCart', cartData)
    }
  },

  async fetchCheckoutId (store:any) {
		let client:any
		if(this && this.app && this.app.apolloProvider && this.app.apolloProvider.defaultClient) {
	    	client = this.app.apolloProvider.defaultClient
	  }
	  if(client) {
      let shouldFetchNewCheckout = false
  		// Check if the ID exists
  		if(localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency)) {
        // Check if the checkout has an orderStatusUrl, i.e. has it been placed already?
        let result = await client.query({
          query: gql`
            query ($checkoutId: ID!) {
              node(id: $checkoutId) {
                ... on Checkout {
                  orderStatusUrl
                }
              }
            }
          `,
          variables: {
              // access state object
            checkoutId: localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency)
          },
          fetchPolicy: 'network-only'
        })

        // If the order has been placed, we need to make a new one
        if(result.data.node.orderStatusUrl) {
          shouldFetchNewCheckout = true
        }
        // Else continue where we left off
        else {
          store.commit('setCheckoutId', localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency))
        }
  		}

      // If we have placed order with last checkout, or there is no previous checkout, create a new one
  		if(shouldFetchNewCheckout || !localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency)) {
  			let result = await client.mutate({
  	      mutation: gql`
  	        mutation {
  	          checkoutCreate(input: {}) {
  	            userErrors {
  	              message
  	              field
  	            }
  	            checkout {
  	              id
  	            }
  	          }
  	        }
  	      `
  	    })

  	    try {
  	      if(result.data.checkoutCreate.checkout.id) {
  	        store.commit('setCheckoutId', result.data.checkoutCreate.checkout.id)
  	        localStorage.setItem('OB_LOW_checkoutID_' + store.state.activeCurrency, result.data.checkoutCreate.checkout.id)
  	      }
  	    } catch(err) {
  	      console.error(err)
  	    }
  		}
	  }
	},

  async updateLineItem (store:any, data:any) {
    let client:any
    if(this && this.app && this.app.apolloProvider && this.app.apolloProvider.defaultClient) {
        client = this.app.apolloProvider.defaultClient
    }
    if(client) {

      // Filter out the variant we're changing quantity for, because we want to maybe remove it
      let cartIds = store.getters.cartIds
      cartIds = cartIds.filter((a:any) => {
        return a.variantId !== data.variantId || JSON.stringify(a.customAttributes) != JSON.stringify(data.customAttributes)
      })

      // If the new quantity is not 0, merge it
      if(data.quantity !== 0) {
        cartIds = [...cartIds, ...[{variantId: data.variantId, quantity: data.quantity, customAttributes: data.customAttributes}]]
      }

      try {
        let result = await client.mutate({
          mutation: gql`
            mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
              checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
                userErrors {
                  message
                  field
                }
                checkout {
                  id
                }
              }
            }`,
          variables: {
            checkoutId: store.state.checkoutId,
            lineItems: cartIds
          }
        })
        store.dispatch('fetchCart')
      } catch(err) {
        console.error(err)
      }
    }
  },

  async fetchCarbonIntensity (store:any) {
  	try {
      let now = new Date()
      let eightHoursAhead = new Date(new Date().setTime(now.getTime() + (16 * 60 * 60 * 1000)))
  		let result = await axios.get(`https://api.carbonintensity.org.uk/regional/intensity/${now.toISOString()}/${eightHoursAhead.toISOString()}/regionid/13`)
  		let carbonIntensity = result.data.data.data[0]

      // DEBUG HERE
      // Change value to 'very low', 'low', 'moderate', 'high' or 'very high' at your leisure
      // carbonIntensity.intensity.index = 'low'

      if(carbonIntensity.intensity.index === 'very high') {
        if(this.app.router) {
          this.app.router.replace('/offline')
        }
      }

  		store.commit('setCarbonIntensity', carbonIntensity)
      store.commit('setCarbonForecast', result.data.data.data)
  	} catch(err) {
  		console.error(err)
  	}
  },

  async fetchActiveCurrency (store:any) {
    let currencies = ['dkk', 'eur', 'usd', 'dev', 'gbp']
    try {
      if(localStorage.getItem('OB_LOW_currency') && localStorage.getItem('OB_LOW_currency') === this.app.context.route.params.locale) {
        store.commit('setActiveCurrency', localStorage.getItem('OB_LOW_currency'))
      }
      else {
        if(this.app.context.route.params.locale && currencies.includes(this.app.context.route.params.locale)) {
          localStorage.setItem('OB_LOW_currency', this.app.context.route.params.locale)
          store.commit('setActiveCurrency', this.app.context.route.params.locale)
        }
        else {
          localStorage.setItem('OB_LOW_currency', store.state.activeCurrency)
        }
      }
      if(this && this.app && this.app.apolloProvider) {
        this.app.apolloProvider.defaultClient = this.app.apolloProvider.clients[store.state.activeCurrency]
      }
    } catch(err) {
      console.error(err)
    }
  },

  async changeCurrency (store:any, data:any) {
    if(this && this.app) {
      if(this.app.apolloProvider) {
        this.app.apolloProvider.defaultClient = this.app.apolloProvider.clients[data]
        store.commit('setActiveCurrency', data)
        localStorage.setItem('OB_LOW_currency', store.state.activeCurrency)
      }

      if(this.app.context && this.app.context.route && this.app.router) {
        let currentPath = this.app.context.route.path
        let oldCurrency = this.app.context.route.params.locale
        let newPath = currentPath.replace(oldCurrency, store.state.activeCurrency)
        this.app.router.replace(newPath)
      }
    }

    store.dispatch('initStore')
  },

  async initStore (store:any) {
    store.dispatch('fetchActiveCurrency')

  	store.dispatch('fetchCarbonIntensity')

  	await store.dispatch('fetchCheckoutId')
  	store.dispatch('fetchCart')

    return Promise.resolve('initStore finished.')
  },

  fetchCookieConsent (store:any, data:any) {
    try {
      if(localStorage.getItem('OB_LOW_cookie_accept')) {
        store.commit('updateCookieConsent', JSON.parse(localStorage.getItem('OB_LOW_cookie_accept') || '{}'))
      }
    } catch(err) {
      console.error(err)
    }
  },

  saveCookieConsent (store:any, data:any) {
    try {
      localStorage.setItem('OB_LOW_cookie_accept', JSON.stringify(store.state.cookieConsent))
    } catch(err) {
      console.error(err)
    }
  }
}
