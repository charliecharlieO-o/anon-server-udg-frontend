
const state = {
  messages: [],
  currentMessage: null
}

const mutations = {
  /**
  * @params {object} message
  * @params {string} message.text
  * @params {object} message.router - Vue router params. If you dont want to
  *   reload the page use this method.
  * @params {string} message.url - External link
  */
  push (state, message) {
    // If there is a current message add the new message to the queue
    if (state.currentMessage) {
      state.messages.push(message)
    // Else  add the new message as current message
    } else {
      state.currentMessage = message
    }
  },

  /**
  * Go to next element in the queue, if there is no elements just clear
  */
  next (state) {
    // Are message in the queue?
    if (state.messages.length) {
      state.currentMessage = state.messages.shift()
    // We don't have messages in the queue, just hide the snackbar
    } else {
      state.currentMessage = null
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
