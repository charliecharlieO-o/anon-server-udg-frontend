import Vue from 'vue'
import Vuex from 'Vuex'
import Http from '@/utils/http'

const { methods } = Http

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    notifications: [],
    jwt: null
  },
  mutations: {
    setNotifications (state, notifications) {
      state.notifications = notifications
    },
    setJWT (state, jwt) {
      Http.setAuthToken(jwt)
      state.jwt = jwt
    }
  },
  actions: {
    async getNotifications (self) {
      const response = await methods.getLatestNotifications()
      console.log('notifications request', response)
      if (response.success) {
        self.commit('setNotifications', response.doc)
      }
    }
  }
})

export default store
