import { reactive, toRefs } from '@vue/composition-api'

// const appId = '945570962630854'
// const appId = '1022679051353479'

let scope

const state = reactive({
  appId: '760685931497688',
  user: undefined,
  model: { connected: undefined },
  loggedIn: false
})
const handleSdkInit = async ({ FB, scope: _scope }) => {
  scope = _scope
  // console.log('getUserID', FB.getUserID())
  // console.log('getUserID', FB.getAuthResponse())
  console.log('handleSdkInit')
  FB.Event.subscribe('auth.authResponseChange', function (response) {
    if (response.status === 'connected') {
      console.log('<br>Connected to Facebook')
      // SUCCESS
      FB.api('/me', { locale: 'tr_TR', fields: 'name, email,birthday, hometown,education,gender,website,work' },
        function (response) {
          state.user = {
            email: response.email,
            name: response.name
          }
          state.loggedIn = true
        }
      )
    } else if (response.status === 'not_authorized') {
      console.log('Failed to Connect')
      state.loggedIn = false
    // FAILED
    } else {
      console.log('Logged Out')
      state.loggedIn = false

    // UNKNOWN ERROR
    }
  })
}

const logout = () => {
  scope.logout()
}

const useFBapi = () => {
  return { handleSdkInit, logout, ...toRefs(state) }
}

export default useFBapi
