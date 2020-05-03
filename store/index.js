export const state = () => ({
  checkoutId: ''
})

export const mutations = {
  set (state, newId) {
    state.checkoutId = newId
  }
}