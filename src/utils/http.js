import Axios from 'axios'
import { API_URL } from '@/env-config'

const http = Axios.create({
  baseURL: API_URL
})

const setAuthToken = (token) => {
  http.defaults.headers.authorization = token
}

const methods = {
  getLatestNotifications () {
    console.log(http.defaults.headers)
    return http.get('/user/notifications/latest')
  }
}

const Http = {
  http,
  setAuthToken,
  methods
}

export default Http
