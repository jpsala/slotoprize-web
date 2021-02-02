import { ref } from '@vue/composition-api'
import { alerta } from 'src/helpers'
let auth2
const _gapiLoaded = ref(false)
let gapi
const user = ref(undefined)
const signedIn = ref(undefined)
const onUserChanged = ref(() => {})
const onSignInChanged = ref(() => {})
let signinOptions = {}

const loadGapi = async () => {
  gapi = await loadGapiScript()
  gapi.load('client:auth2', initSigninV2)
}

const initSigninV2 = async function () {
  gapi.auth2.init({
    // client_id: '231770135835-e20qspi3q51g7dc5t0ai4pkq2585p9uk.apps.googleusercontent.com',
    client_id: '1061068102804-lel298q90msfbdl286d6dg6kufe40ehc.apps.googleusercontent.com',
    scope: 'profile'
  })

  _gapiLoaded.value = true

  auth2 = gapi.auth2.getAuthInstance()
  auth2.isSignedIn.listen(signinChanged)
  auth2.currentUser.listen(userChanged)

  signinOptions = new gapi.auth2.SigninOptionsBuilder()
  signinOptions.setPrompt('select_account')
  signinOptions.setScope('profile').setScope('email')
}

const signinChanged = function (_signedIn) {
  console.log('userGapi: signinChanged', _signedIn, user.value?.name)
  if (signedIn.value === _signedIn) {
    console.log('userGapi: signinChanged: signedIn.value === _signedIn returning', signedIn.value === _signedIn)
    return
  }
  if (!_signedIn) {
    console.log('userGapi: signinChanged: Deleting user and signedIn')
    user.value = undefined
  }
  signedIn.value = _signedIn
  onSignInChanged.value(_signedIn)
}

const userChanged = function (_user) {
  if (!auth2.isSignedIn.get()) {
    console.log('userGapi: userChanged: signed in is false, returning')
    return
  }
  if (_user) {
    const profile = auth2.currentUser.get().getBasicProfile()
    if (!profile) {
      console.log('maaal')
    }
    user.value = {
      id: profile.getId(),
      name: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      imageUrl: profile.getImageUrl(),
      email: profile.getEmail()
    }
  } else {
    console.log('userGapi: maaal')
    user.value = undefined
  }
}

const signIn = async function () {
  if (!auth2) await alerta('Auth2 not loaded')
  await auth2.signIn(signinOptions)
}

const signOut = async function () {
  await auth2.signOut()
  console.log('userGapi: : signed Out')
}

function loadGapiScript () {
  return new Promise(function (resolve, reject) {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onreadystatechange = script.onload = function () {
      const interval = setInterval(function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          clearInterval(interval)
          if (window.gapi) {
            resolve(window.gapi)
          } else {
            reject()
          }
        }
      }, 100)
    }
    script.onerror = function (message, url, line, column, error) {
      reject({ message: message, url: url, line: line, column: column, error: error })
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}

loadGapi().then(() => {
  console.log('userGapi: Gapi loaded and initialized')
})

const useGapi = () => {
  return { user, signedIn, signIn, signOut, onUserChanged, onSignInChanged }
}
export default useGapi
