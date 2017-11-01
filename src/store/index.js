import Vue from 'vue'
import Vuex from 'Vuex'
import Http from '@/utils/http'

const { methods } = Http

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    notifications: [],
    jwt: null,
    showNotification: false
  },
  mutations: {
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
  },
  actions: {
    async getNotifications (self) {
      const response = await methods.getLatestNotifications()
      console.log('notifications response data:', response.data.doc)
      if (response.data.success) {
        self.commit('setNotifications', response.data.doc)
      }
    }
  }
})

export default store
