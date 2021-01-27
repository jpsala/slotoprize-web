/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import { whichBox } from 'src/helpers'

import useGlobal from '../services/useGlobal'
import { setApiToken, getApiToken } from './useSession'
// import router from '../router';
const { isDev, isLocal } = whichBox()
let apiToken
const getAxios = () => {
  const { startLoading, stopLoading } = useGlobal()
  console.log('Axios, solo una vez!')
  console.log('isDev', isDev, typeof (isDev))
  if (isLocal) axios.defaults.baseURL = 'http://localhost:8888/api'
  else if (isDev) axios.defaults.baseURL = 'https://dev.slotoprizes.tagadagames.com:3000/api'
  else axios.defaults.baseURL = 'https://slotoprizes.tagadagames.com:3000/api'
  console.log('axios.defaults.baseURL', axios.defaults.baseURL)
  axios.interceptors.response.use((response) => {
    setTimeout(() => {
      stopLoading()
    }, 500)
    const endPoint = response.config.url.substring(response.config.url.lastIndexOf('/') + 1)
    console.log('endpoint %O %O response.data %O', endPoint, response, response.data)
    if (response.data && (response.data.jwt || response.headers.token)) {
      apiToken = response.data.jwt || response.headers.token
      setApiToken(apiToken)
    }
    return response
  }, (error) => {
    stopLoading()
    console.log('error', error)
    let msg = error.response?.data?.message
    if (!msg) msg = error.message
    if (!msg) msg = error
    console.log('Error en axios.interceptors.response: ', msg)
    // throw error;
    return Promise.reject(msg)
  })

  axios.interceptors.request.use(
    async (config) => {
      startLoading()
      if (!apiToken) apiToken = getApiToken()
      // console.log('config.url', config.url, config.headers)
      if (config.url !== '/auth') config.headers.token = apiToken
      // if (config.url !== '/auth/local') console.log('/auth/local')
      return config
    },
    (error) => Promise.reject(error)
  )
  axios.defaults.method = 'GET'
  return axios
}
const _axios = getAxios()
export default _axios
