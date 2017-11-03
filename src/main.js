// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import Vuetify from 'vuetify'

import 'material-design-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false
Vue.use(VueSession)
Vue.use(Vuetify)

Vue.prototype.$eventHub = new Vue() // Global event bus

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
