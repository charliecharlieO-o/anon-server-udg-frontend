import Vue from 'vue'
import Vuex from 'vuex'
import Http from '@/utils/http'

import snackbar from './snackbar'

const { methods } = Http

Vue.use(Vuex)

const state = {
  notifications: [],
  jwt: null,
  showNotification: false
}

const mutations = {
  setNotifications (state, notifications) {
    state.notifications = notifications
  },
  setJWT (state, jwt) {
    Http.setAuthToken(jwt)
    state.jwt = jwt
  },
  showNotification (state, show) {
    state.showNotification = show
  }
}

const actions = {
  async getNotifications (self) {
    const response = await methods.getLatestNotifications()
    console.log('notifications response data:', response.data.doc)
    if (response.data.success) {
      self.commit('setNotifications', response.data.doc)
    }
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    snackbar
  }
})

export default store
