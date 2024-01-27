// First import createStore function from Framework7 core
// @ts-ignore because types are not available
import { createStore } from 'framework7/lite'

// create store
const appState = createStore({
  // start with the state (store data)
  state: {
    hasSidePanel: true
  },

  // actions to operate with state and for async manipulations
  actions: {
    // context object containing store state will be passed as an argument
    setSidePanel(context: any, show: boolean) {
      context.state.hasSidePanel = show
    }
  },

  // getters to retrieve the state
  getters: {
    // context object containing store state will be passed as an argument
    getSidePanelState(context: any) {
      return context.state.hasSidePanel
    }
  }
})

// export store
export default appState
