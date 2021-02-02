/* google oauth
231770135835-e20qspi3q51g7dc5t0ai4pkq2585p9uk.apps.googleusercontent.com
XPZjd53OEvL9HfeWFtmYmKx3
*/
import activationToken from '../services/checkActivation'
import { reactive, computed, watch, ref } from '@vue/composition-api'
import useGapi from '../services/useGapi'
import useFBapi from '../services/useFBapi'

import axios from './axios'
// import { router } from '../boot/router'
import { alerta } from 'src/helpers'
import useGlobal from '../services/useGlobal'
import useSloto from '../services/useSloto'

const { showSpinner, hideSpinner } = useGlobal()
const { maxMultiplier } = useSloto()
const jwtSecret = 'wopidom.portal'

const state = reactive({
  loading: false,
  apiToken: window.localStorage.getItem(jwtSecret),
  user: undefined
})

const isGoogleUser = ref(false)
const isFacebookUser = ref(false)

export const setApiToken = (value) => {
  state.apiToken = value
  window.localStorage.setItem(jwtSecret, value)
}

// eslint-disable-next-line no-unused-vars
const {
  user: googleUser, signedIn: googleSignedIn,
  signOut: googleSignOut, signIn: googleSignIn
} = useGapi()
const { user: fbUser, loggedIn: fbLoggedIn, logout: facebookSignOut } = useFBapi()

let handlingGoogleLogin = false
let handlingFacebookLogin = false
const user = computed(() => state.user)
const apiToken = computed(() => state.apiToken)
const loggedIn = computed(() => Boolean(state.user), { inmediate: true })
const isDev = computed(() => state.user && state.user.isDev === 1)

let loggedInHandle = () => false
const onLoggedInChange = (cb) => { loggedInHandle = cb }

const setDataFromEndPoint = (data) => {
  state.user = data?.user || undefined
  if (data?.maxMultiplier) maxMultiplier.value = data.maxMultiplier
}

const logout = async () => {
  if (googleSignedIn.value) {
    await googleSignOut()
  }
  if (fbLoggedIn.value) {
    await facebookSignOut()
  }
  setApiToken(undefined)
  setDataFromEndPoint(undefined)
  window.location.reload()
  // router.push('/login').catch(() => {})
}

const signUp = async (_user) => {
  if (loggedIn.value) return loggedIn.value
  try {
    const response = await axios.post('/portal/sign_up', _user)
    if (!response) throw Error('Error de conexión')
    if (response.status !== 200) return response
    setApiToken(response.headers.token)
    setDataFromEndPoint(response.data)
    return response
  } catch (error) {
    await alerta('Error', error)
  }
}

const login = async (_user) => {
  if (loggedIn.value) return loggedIn.value
  try {
    const response = await axios.post('/portal/auth', _user)
    if (!response) throw Error('Error de conexión')
    if (response.status !== 200) return response
    setApiToken(response.headers.token)
    setDataFromEndPoint(response.data)
    return response
  } catch (error) {
    await alerta('Error', error)
  }
}

const tryToLogin = async () => {
  if (activationToken) {
    try {
      const response = await axios.post('/portal/activation', { token: activationToken })
      setDataFromEndPoint(response.data)
      return Boolean(response.data)
    } catch (error) {
      return false
    }
  } else if (!apiToken.value || apiToken.value === 'undefined') {
    console.log('activation, no token, returning')
    return
  }
  try {
    const response = await axios.post('/portal/auth-with-token', { token: apiToken.value })
    setDataFromEndPoint(response.data)
    return Boolean(response.data)
  } catch (error) {
    return false
  }
}

const handleGoogleLogin = async (userData) => {
  if (loggedIn.value) {
    return
  }
  try {
    if (handlingGoogleLogin) { console.log('handleGoogleLogin: Already handling google login') }
    if (handlingGoogleLogin) return
    handlingGoogleLogin = true
    isGoogleUser.value = false
    showSpinner()
    const response = await axios.post('/portal/google_login', userData)
    isGoogleUser.value = true
    setDataFromEndPoint(response.data)
    setApiToken(response.headers.token)
    hideSpinner()
    return Boolean(response.data)
  } catch (error) {
    hideSpinner()
    console.log('handleGoogleLogin Google sign in error', error)
    // router.push('/login').catch(() => {})
    return false
  } finally {
    handlingGoogleLogin = false
  }
}

const handleFacebookLogin = async (userData) => {
  if (loggedIn.value) {
    console.log('handleFacebookLogin, already logged in user:', user.value)
    return
  }
  try {
    if (handlingFacebookLogin) { console.log('handleFacebookLogin: Already handling google login') }
    if (handlingFacebookLogin) return
    handlingFacebookLogin = true
    isFacebookUser.value = false
    showSpinner()
    const response = await axios.post('/portal/facebook_login', userData)
    isFacebookUser.value = true
    setDataFromEndPoint(response.data)
    setApiToken(response.headers.token)
    hideSpinner()
    return Boolean(response.data)
  } catch (error) {
    hideSpinner()
    console.log('handleFacebookLogin sign in error', error)
    // router.push('/login').catch(() => {})
    return false
  } finally {
    handlingFacebookLogin = false
  }
}

const googleLogin = async () => {
  await googleSignIn()
  return { status: 200 }
}

watch(() => Boolean(state.user), (loggendIn) => {
  loggedInHandle(loggendIn)
}, { immediate: true })

watch(googleSignedIn, async (signedIn) => {
  if (!signedIn) {
    console.log('Google not signedIn, return')
    return
  }
  if (googleUser.value) {
    await handleGoogleLogin(googleUser.value)
  }
})

watch(() => Boolean(fbLoggedIn.value), async (signedIn) => {
  if (!signedIn) {
    console.log('FB not signedIn, return')
    return
  }
  if (fbUser.value) {
    console.log('facebookSignedIn: calling handleFacebookLogin')
    await handleFacebookLogin(fbUser.value)
  }
}, { immediate: true })

const useSession = () => {
  return {
    user,
    isDev,
    tryToLogin,
    login,
    logout,
    loggedIn,
    setApiToken,
    apiToken,
    onLoggedInChange,
    googleLogin,
    isGoogleUser,
    signUp
  }
}

export const getApiToken = (value) => state.apiToken
export default useSession
