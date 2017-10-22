import axios from 'axios'
import {validateEmail} from './validation'

const moment = require('moment')

const BASE_URL = 'http://192.168.100.11:3000'
const DEV_URL = 'http://192.168.100.5:8080'

export {
  getBaseUrl, standardLogin, standardUnauthPost, standardAuthPut, standardAuthPost, standardAuthGet, getDevUrl,
  parseThreads, standardAuthUpload, parseComment
}

function getBaseUrl() {
  return BASE_URL
}

function getDevUrl() {
  return DEV_URL
}

function standardLogin(user, password) {
  const url = (validateEmail(user))? `${BASE_URL}/user/login/email` : `${BASE_URL}/user/login/standard`
  return axios.post(url,{
    'username': user,
    'email': user,
    'password': password
  })
}

function standardUnauthPost(jsonParams, objectUrlPath) {
  const url = `${BASE_URL}${objectUrlPath}`
  return axios.post(url,jsonParams)
}

function standardAuthPost(jsonParams, jwtToken, objectUrlPath) {
  const url = `${BASE_URL}${objectUrlPath}`
  return axios.post(url,jsonParams)
}

function standardAuthPut(jsonParams, jwtToken, objectUrlPath) {
  const url = `${BASE_URL}${objectUrlPath}`
  return axios.put(url,
    {
      'data': jsonParams,
      'headers': {
            'authorization': jwtToken
      }
  })
}

function standardAuthGet(jwtToken, objectUrlPath) {
  const url = `${BASE_URL}${objectUrlPath}`
  return axios.get(url, {
      'headers': {
        'authorization': jwtToken
      }
    })
}

function standardAuthUpload(jwtToken, objectUrlPath, formData) {
  const url = `${BASE_URL}${objectUrlPath}`
  return axios.post(url, formData, {
    'headers': {
      'Content-Type': 'multipart/form-data',
      'authorization': jwtToken
    }
  })
}

// Utilities

function parseThreads(threads) {
  for (let i = 0; i < threads.length; i++) {
    // Parse Time
    threads[i].created_at = moment(threads[i].created_at).fromNow()
    // Trim title
    if (threads[i].title.length > 43) {
      threads[i].title = `${threads[i].title.substr(0, 40)}...`
    }
    // Trim text
    if (threads[i].text && threads[i].text.length > 200) {
      threads[i].text = `${threads[i].text.substr(0, 100)}...`
    } else if (threads[i].text && !threads[i].media && threads[i].text.length > 500) {
      threads[i].text = `${threads[i].text.substr(0, 500)}...`
    }
    // Parse thumbnail route
    if (threads[i].media && threads[i].media.thumbnail) {
      let str = threads[i].media.thumbnail
      str = str.substr(str.lastIndexOf('/') + 1)
      // threads[i].media.thumbnail = `/media/${str}` on production
      threads[i].media.thumbnail = `${BASE_URL}/media/${str}` // for testing
    }
  }
  return threads
}

function parseComment(comment) {
  // Prepare thumbnail
  if (comment.poster.poster_thumbnail) {
    let str = comment.poster.poster_thumbnail
    str = str.substr(str.lastIndexOf('/') + 1)
    // comment.poster.poster_thumbnail = `/media/${str}` on production
    comment.poster.poster_thumbnail = `${getBaseUrl()}/media/${str}` // for testing
  } else {
    // Insert Default Image
    comment.poster.poster_thumbnail = '/static/thumbnail.jpg'
  }
  // Prepare media
  if (comment.media && comment.media.thumbnail) {
    let str = comment.media.thumbnail
    str = str.substr(str.lastIndexOf('/') + 1)
    // comment.media.thumbnail = `/media/${str}` on production
    comment.media.thumbnail = `${getBaseUrl()}/media/${str}` // for testing
  }
  // Remove this if on PRODUCTION
  if (comment.created_at)
    comment.created_at = moment(comment.created_at).fromNow()
  else if (comment.createdAt)
    comment.createdAt = moment(comment.createdAt).fromNow()
  return comment
}
