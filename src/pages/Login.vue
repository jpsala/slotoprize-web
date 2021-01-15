<template>
  <div class="q-pa-md row q-gutter-md justify-center q-mt-lg">
    <q-card class="my-card">

      <q-card-section>
        <div class="text-h5">Welcome to Sloto Prizes</div>
        <div class="text-subtitle2">Login to play</div>
      </q-card-section>

      <q-separator />

      <q-form class="q-gutter-md" @submit="onSubmit">

        <q-card-section v-if="isLogin" class="q-mt-xl q-mx-lg">
          <q-input
            v-model="user.email"
            label="Email address *"
            :filled="false"
            autofocus
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Enter your email address']"
            type="email"
          />
          <q-input
            v-model="user.password"
            type="password"
            label="Password *"
            lazy-rules
            :rules="[val => val !== null && val !== '' || 'Enter your Password']"
          />
        </q-card-section>

        <q-card-section v-if="!isLogin" class="q-mt-xl q-mx-lg">
          <q-input
            v-model="user.name"
            type="text"
            label="First Name"
            autofocus
            lazy-rules
            :rules="[val => val !== null && val !== '' || 'Enter your first name']"
          />
          <q-input
            v-model="user.email"
            label="Email *"
            :filled="false"
            lazy-rules
            :rules="[ val => val && val.length > 0 && val.indexOf('@') >= 0 || 'Enter your Email']"
            type="email"
          />
        </q-card-section>

        <q-card-actions v-if="isLogin" align="right" class="q-mt-md q-mb-md q-mr-sm">
          <q-btn label="Sign In" :disable="!user.email || !user.password" type="submit" color="primary" class="q-ml-md signin-button"/>
        </q-card-actions>

        <q-card-actions v-if="!isLogin" align="right" class="q-mt-md q-mb-md q-mr-sm">
          <q-btn @click="signUp" :disable="!user.email || !user.name" label="I'M REGISTERING" color="primary" class="q-ml-md signup-button"/>
        </q-card-actions>

          <separator />

        <q-card-actions align="right" class="q-mt-md q-mb-md q-mr-sm" style="flex-direction: column">

          <div class="row justify-center">

            <div class="google-btn" @click="googleLogin">
              <div class="google-icon-wrapper">
                <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
              </div>
              <p class="btn-text"><b>Sign in with google</b></p>
            </div>

            <v-facebook-login v-model="fbModel" @sdk-init="handleSdkInit" :app-id="appId"
                              class="fb-button">
            </v-facebook-login>

            <div v-if="!isLogin" @click="isLogin = !isLogin" class="login-div-button"><span class="text-grey-8">Already registered on Sloto Prizes? </span>Login</div>
            <div class="row">
              <div v-if="isLogin" class="sign-up-div-label">New to Sloto Prizes?&nbsp;</div>
              <div v-if="isLogin" @click="isLogin = !isLogin" class="sign-up-div-button"> Register for free</div>
            </div>

          </div>

        </q-card-actions>

      </q-form>

    </q-card>

  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import useSession from '../services/useSession'
import useFBapi from '../services/useFBapi'
import separator from '../components/Separator'
import VFacebookLogin from 'vue-facebook-login-component'

export default {
  components: { separator, VFacebookLogin },
  setup (props, ctx) {
    const user = ref({
      email: '',
      password: ''
    })

    const isLogin = ref(false)

    const { login, logout, loggedIn, googleLogin, signUp: sessionSignUp } = useSession()
    const { handleSdkInit, user: fbUser, model: fbModel, appId } = useFBapi()

    const gotoHomePage = () => {
      ctx.root.$router.push({ path: 'game' }).catch(() => {})
    }

    const notifyFailure = (error) => {
      console.log('error', error?.status || error)
      ctx.root.$q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: error
        // message: error?.status || error
      })
    }

    const signUp = async () => {
      try {
        const loginData = await sessionSignUp(user.value)
        if (loginData.status === 200) gotoHomePage()
        else { notifyFailure(`error status: ${loginData.status}`) }
      } catch (error) {
        console.error('onsubmit', error)
        if (error.status === 401) notifyFailure('Revise los datos (401)')
        else notifyFailure(`error: ${error}`)
      }
    }

    const onSubmit = async () => {
      try {
        const loginData = await login(user.value)
        if (loginData.status && loginData.status === 200) gotoHomePage()
        else { notifyFailure(`error status: ${loginData?.status || loginData}`) }
      } catch (error) {
        console.error('onsubmit', error)
        if (error?.status === 401) notifyFailure('Revise los datos (401)')
        else notifyFailure(`error: ${error}`)
      }
    }

    watch(() => loggedIn.value, (_loggedIn) => {
      if (_loggedIn) gotoHomePage()
    }, { immediate: true })

    return {
      user,
      login,
      logout,
      onSubmit,
      googleLogin,
      isLogin,
      signUp,
      handleSdkInit,
      fbModel,
      appId,
      fbUser
    }
  }
}
</script>

<style lang="scss">
.fb-button, .google-btn{
  box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
  &:hover{
    box-shadow: 0 0 4px #1976D2;
  }
  margin-left: 13px;
  @media (max-width: $breakpoint-xs-max){
    width: 80% !important;
  }
}
.my-card{
  @media (max-width: $breakpoint-xs-max){
    width: 100%;
    max-width: 450px;
    min-width: 250px;
  }
  @media (min-width: $breakpoint-sm-min){
    width: 550px;
  }
  font-size: 10px;
  .seccion-ingreso{
    background-color: $primary;
    color: white;
  }
  .login-div-button, .sign-up-div-button{
    cursor: pointer;
    margin: 32px auto -14px auto;
    font-size: 1rem;
    color: $blue-7
  }
  .sign-up-div-label{
    margin: 32px auto -14px auto;
    font-size: 1rem;
    color: $grey-8
  }
  .signin-button{
    width: 60%;
    margin: auto;
  }
  .signup-button{
      width: 80%;
      margin: auto;
  }
  $white: #fff;
  $google-blue: #4285f4;
  $button-active-blue: #1669F2;

  .google-btn {
    width: 184px;
    height: 42px;
    background-color: $primary;
    cursor: pointer;
    border-radius: 2px;
    box-shadow: 0 3px 4px 0 rgba(0,0,0,.25);
    .google-icon-wrapper {
      position: absolute;
      margin-top: 1px;
      margin-left: 1px;
      width: 40px;
      height: 40px;
      border-radius: 2px;
      background-color: $white;
    }
    .google-icon {
      position: absolute;
      margin-top: 11px;
      margin-left: 11px;
      width: 18px;
      height: 18px;
    }
    .btn-text {
      float: right;
      margin: 11px 11px 0 0;
      color: $white;
      font-size: 14px;
      letter-spacing: 0.2px;
      font-family: "Titillium";
    }
    &:hover {
      box-shadow: 0 0 4px $google-blue;
    }
    &:active {
      background: $button-active-blue;
    }
  }
}
</style>
