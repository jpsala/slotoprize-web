/* google oauth
231770135835-e20qspi3q51g7dc5t0ai4pkq2585p9uk.apps.googleusercontent.com
XPZjd53OEvL9HfeWFtmYmKx3
*/
import { reactive, computed, watch, ref } from '@vue/composition-api'
import useGapi from '../services/useGapi'
import useFBapi from '../services/useFBapi'

// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import axios from './axios'
import { router } from '../boot/router'
import { alerta } from 'src/helpers'
import useGlobal from '../services/useGlobal'

const { showSpinner, hideSpinner } = useGlobal()
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
const setUser = (data) => { state.user = data; console.log('user', state.user) }

const logout = async () => {
  if (googleSignedIn.value) {
    await googleSignOut()
  }
  if (fbLoggedIn.value) {
    await facebookSignOut()
  }
  setApiToken(undefined)
  setUser(undefined)
  router.push('/login').catch(() => {})
  // dispatch('setHijoActivo', undefined);
}

const signUp = async (_user) => {
  if (loggedIn.value) return loggedIn.value
  try {
    const response = await axios.post('/portal/sign_up', _user)
    if (!response) throw Error('Error de conexión')
    if (response.status !== 200) return response
    setApiToken(response.headers.token)
    setUser(response.data)
    return response
  } catch (error) {
    await alerta('Error trying to login', error)
  }
}

const login = async (_user) => {
  if (loggedIn.value) return loggedIn.value
  try {
    const response = await axios.post('/portal/auth', _user)
    if (!response) throw Error('Error de conexión')
    if (response.status !== 200) return response
    setApiToken(response.headers.token)
    setUser(response.data)
    return response
  } catch (error) {
    await alerta('Error trying to login', error)
  }
}

const tryToLogin = async () => {
  console.log('detalle', apiToken)
  if (!apiToken.value || apiToken.value === 'undefined') {
    console.log('tryToLogin, no token, returning')
    return
  }
  try {
    const response = await axios.post('/portal/auth-with-token', { token: apiToken.value })
    setUser(response.data)
    return Boolean(response.data)
  } catch (error) {
    return false
  }
}

// eslint-disable-next-line no-unused-vars
const handleGoogleLogin = async (userData) => {
  if (loggedIn.value) {
    console.log('handleGoogleLogin, already logged in user:', user.value)
    return
  }
  try {
    if (handlingGoogleLogin) { console.log('handleGoogleLogin: Already handling google login') }
    if (handlingGoogleLogin) return
    handlingGoogleLogin = true
    isGoogleUser.value = false
    showSpinner()
    const response = await axios.post('/portal/google_login', userData)
    console.log('handleGoogleLogin', userData.name)
    isGoogleUser.value = true
    setUser(response.data)
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
    console.log('handleFacebookLogin', userData.name)
    isFacebookUser.value = true
    setUser(response.data)
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
    console.log('googleSignedIn: calling handleGoogleLogin')
    await handleGoogleLogin(googleUser.value)
  }
})

watch(() => Boolean(fbLoggedIn.value), async (signedIn) => {
  console.warn('useSession: watch fbLoggedIn')
  if (!signedIn) {
    console.warn('FB not signedIn, return')
    return
  }
  if (fbUser.value) {
    console.warn('facebookSignedIn: calling handleFacebookLogin')
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