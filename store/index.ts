import { GetterTree, ActionTree, MutationTree } from 'vuex'
import gql from 'graphql-tag'
import axios from 'axios'

export const state = () => ({
  checkoutId: '',
  cart: {},
  carbonIntensity: {}
})

export type RootState = ReturnType<typeof state>

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

export const mutations: MutationTree<RootState> = {
  setCheckoutId: (state, newId:string) => (state.checkoutId = newId),
  saveCart: (state, cart:any) => (state.cart = cart),
  setCarbonIntensity: (state, intensity:any) => (state.carbonIntensity = intensity)
}

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
	        checkoutId: store.state.checkoutId
	      },
	      fetchPolicy: 'network-only'
			})
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
  		if(localStorage.getItem('OB_LOW_checkoutID')) {
  			store.commit('setCheckoutId', localStorage.getItem('OB_LOW_checkoutID'))
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
  	        localStorage.setItem('OB_LOW_checkoutID', result.data.checkoutCreate.checkout.id)
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

  async initStore (store:any) {
  	store.dispatch('fetchCarbonIntensity')

  	await store.dispatch('fetchCheckoutId')
  	store.dispatch('fetchCart')
  }
}