import { ref, computed } from '@vue/composition-api'

const _gapiLoaded = ref(false)
const gapi = ref(undefined)

getClient().then(_gapi => {
  console.log('Gapi was loaded:', _gapi)
  gapi.value = _gapi
  _gapiLoaded.value = true
  gapi.value.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
  updateSigninStatus(gapi.value.auth2.getAuthInstance().isSignedIn.get())
})
const userChanged = function (user) {
  console.log('User now: ', user)
}
function getClient () {
  const apiConfig = {
    clientId: '231770135835-e20qspi3q51g7dc5t0ai4pkq2585p9uk.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.email'
  }
  const promise = loadGapiScript().then(function (gapi) {
    return new Promise(function (resolve, reject) {
      gapi.load('client:auth2', function () {
        gapi.client.init(apiConfig).then(function () {
          resolve(gapi)
        }, reject)
      })
    })
  })
  return promise
}

const gapiLoaded = computed(() => {
  return _gapiLoaded
})

function updateSigninStatus (isSignedIn) {
  if (isSignedIn) {
    console.log('signed in')
    gapi.value.auth2.currentUser.listen(userChanged)
  } else {
    console.log('not signed in')
  }
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
const userGapi = () => {
  return { gapiLoaded, gapi: gapi }
}

export default userGapi
