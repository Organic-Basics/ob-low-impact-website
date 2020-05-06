import { GetterTree, ActionTree, MutationTree } from 'vuex'
import gql from 'graphql-tag'

export const state = () => ({
  checkoutId: '',
  lineItems: [] as any[]
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setCheckoutId: (state, newId:string) => (state.checkoutId = newId),
	setLineItems: (state, newLineItems:any[]) => (state.lineItems = newLineItems)
}

export const actions: ActionTree<RootState, RootState> = {
  async fetchCart (store:any) {
  	let client:any
  	if(this && this.app && this.app.apolloProvider && this.app.apolloProvider.defaultClient) {
      	client = this.app.apolloProvider.defaultClient
    }
    if(client) {
    	console.log(store.state.checkoutId)
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
			store.commit('setLineItems', result.data.node.lineItems)
			console.log(result.data)
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
  	      console.log('Fresh Checkout ID: ' + result.data.checkoutCreate.checkout.id)
  	      if(result.data.checkoutCreate.checkout.id) {
  	        store.commit('setCheckoutId', result.data.checkoutCreate.checkout.id)
  	        localStorage.setItem('OB_LOW_checkoutID', result.data.checkoutCreate.checkout.id)
  	      }
  	    } catch(err) {
  	      console.error(err)
  	    }
  		}
	  }
  }
}