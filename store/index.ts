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
  		console.log(store)
      	let client = this.app.apolloProvider.defaultClient
      	console.log(store.state.checkoutId)
      	console.log(client)
      	console.time('fetchCart')
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
		console.timeEnd('fetchCart')
  }
}