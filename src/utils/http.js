import Axios from 'axios'
import { API_URL } from '@/env-config'

const http = Axios.create({
  baseURL: API_URL
})

const setAuthToken = (token) => {
  console.log('set authorization')
  http.defaults.headers.common['authorization'] = token
}

const methods = {
  getLatestNotifications () {
    console.log('headers: ', http.defaults.headers)
    return http.get('/user/notifications/latest')
  }
}

const Http = {
  http,
  setAuthToken,
  methods
}

export default Http
