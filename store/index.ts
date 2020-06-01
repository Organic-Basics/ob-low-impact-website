import { GetterTree, ActionTree, MutationTree } from 'vuex'
import gql from 'graphql-tag'
import axios from 'axios'

// init Vuex state object
export const state = () => ({
  checkoutId: '',
  cart: {},
  carbonIntensity: {},
  activeCurrency: 'eur'
})

export type RootState = ReturnType<typeof state>

// provide Vuex getters
export const getters: GetterTree<RootState, RootState> = {
	cartIds: (state:any):any => {
    let cartIds:any[] = []
    state.cart.lineItems.edges.forEach((a:any) => {
      cartIds.push({
        variantId: a.node.variant.id,
        quantity: a.node.quantity
      })
    })
    return cartIds
  }
}

// provide Vuex mutations
export const mutations: MutationTree<RootState> = {
  // access the state object with state.checkoutId
  setCheckoutId: (state, newId:string) => (state.checkoutId = newId),
  setActiveCurrency: (state, currency:string) => (state.activeCurrency = currency),
  saveCart: (state, cart:any) => (state.cart = cart),
  setCarbonIntensity: (state, intensity:any) => (state.carbonIntensity = intensity)
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
	              subtotalPrice
	              totalTax
	              totalPrice
	              lineItems (first:20) {
	                edges {
	                  node {
	                    title
	                    variant {
	                      title
                        id
	                      image {
	                        src
	                      }
	                      price
	                    }
	                    quantity
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

      // trigger a change with store.commit
			store.commit('saveCart', result.data.node)
    }
  },

  async fetchCheckoutId (store:any) {
		let client:any
		if(this && this.app && this.app.apolloProvider && this.app.apolloProvider.defaultClient) {
	    	client = this.app.apolloProvider.defaultClient
	  }
	  if(client) {
  		// Check if the ID exists
  		if(localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency)) {
  			store.commit('setCheckoutId', localStorage.getItem('OB_LOW_checkoutID_' + store.state.activeCurrency))
  		}
  		else {
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

      // Remove the variant we're changing quantity for, because we want to maybe remove it
      let cartIds = store.getters.cartIds.filter((a:any) => {
        return a.variantId !== data.variantId
      })
      // If the new quantity is not 0, merge it
      if(data.quantity !== 0) {
        cartIds = [...cartIds, ...[{variantId: data.variantId, quantity: data.quantity}]]
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
  		let result = await axios.get('https://api.carbonintensity.org.uk/regional/regionid/13')
  		let carbonIntensity = result.data.data.pop().data.pop()
  		store.commit('setCarbonIntensity', carbonIntensity)
  	} catch(err) {
  		console.error(err)
  	}
  },

  async fetchActiveCurrency (store:any) {
    try {
      if(localStorage.getItem('OB_LOW_currency')) {
        store.commit('setActiveCurrency', localStorage.getItem('OB_LOW_currency'))
      }
      else {
        localStorage.setItem('OB_LOW_currency', store.state.activeCurrency)
      }
      if(this && this.app && this.app.apolloProvider) {
        this.app.apolloProvider.defaultClient = this.app.apolloProvider.clients[store.state.activeCurrency]
      }
    } catch(err) {
      console.error(err)
    }
  },

  async changeCurrency (store:any, data:any) {
    if(this && this.app && this.app.apolloProvider) {
      this.app.apolloProvider.defaultClient = this.app.apolloProvider.clients[data]
      store.commit('setActiveCurrency', data)
      localStorage.setItem('OB_LOW_currency', store.state.activeCurrency)
    }
    let currentPath = this.$router.history.current.path
    let oldCurrency = this.$router.history.current.params.locale
    let newPath = currentPath.replace(oldCurrency, store.state.activeCurrency)
    this.$router.replace(newPath)

    store.dispatch('initStore')
  },

  async initStore (store:any) {
    store.dispatch('fetchActiveCurrency')

  	store.dispatch('fetchCarbonIntensity')

  	await store.dispatch('fetchCheckoutId')
  	store.dispatch('fetchCart')
  }
}
