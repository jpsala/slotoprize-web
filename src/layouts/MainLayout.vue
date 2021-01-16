<template>
  <q-layout view="hHh lpR fFf">

    <q-ajax-bar size="2px" />

    <q-header class="isDevEnv ? 'bg-secondary text-subtitle1':''" elevated>

      <q-toolbar class="bg-white">

        <q-toolbar-title class="q-ml-xs" style="margin-top: 0px">
        <div class="layout-logo-wrapper">
          <img src="../assets/logo.png" class="layout-logo" />
        </div>

        </q-toolbar-title>

        <!-- <span
          v-show="isDevEnv"
          class="q-mr-md"
          style="color:#ffeb3bcf; font-size: 100%"
        >DevMode!</span> -->

        <span class="q-mr-md" style="color:blue; font-size: 110%" ><!-- UTC Date {{ utcDate }} --></span>
        <q-btn v-if="loggedIn" dense flat round icon="menu" @click.stop="left = !left" color="grey-9" class="self-end q-mb-sm"/>

        <q-btn v-if="$route.path !== '/login' && !loggedIn" flat class="self-end" @click="$router.push('/login')">
          <span>Ingreso/Registro</span>
        </q-btn>
        <!-- profile menu , ya ingresó-->

        <q-spinner-tail v-show="loading" color="blue" size="2em" />

        <q-btn-dropdown v-if="loggedIn" id="profile-btn" ref="profileBtn" color="grey-8" flat v-remove-arrow
                        icon="person" :label="user.firstName" class="self-end q-mb-sm btn-user">
          <q-list style="width: 180px">
            <q-item v-close-popup v-ripple clickable>
              <q-item-section side>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section @click="logout">
                Close Session
              </q-item-section>
            </q-item>
          </q-list>

        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" :breakpoint="800" :width="320" side="right" overlay bordered>
      <q-list class="rounded-borders">
        <drawer-content v-if="loggedIn" :items="items" @close="()=>{left = false}"/>
        <!-- <q-item v-if="loggedIn" exact style="cursor: pointer" @click.native="logout()" >
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>Cerrar Sesión</q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container id="page-container">
      <router-view />
    </q-page-container>
    <v-facebook-login v-show="false" v-model="fbModel" @sdk-init="handleSdkInit" :app-id="appId" class="fb-button"></v-facebook-login>
  </q-layout>
</template>

<script>

import { ref, onBeforeMount, watch } from '@vue/composition-api'
import { RemoveArrow } from 'app/src/components/RemoveArrowDirective'
import drawerContent from 'app/src/components/DrawerContent'
import useSession from '../services/useSession'
import useGapi from '../services/useGapi'
import useGlobal from '../services/useGlobal'
import { router } from '../boot/router'
import VFacebookLogin from 'vue-facebook-login-component'
import useFBapi from '../services/useFBapi'
import { Screen } from 'quasar'

function setItemsDefaults (items, level = 0) {
  items.forEach((e) => {
    if (e.protected === undefined) e.protected = false
    e.level = level
    // if (level === 0) e.group = 'uno';
    e.group = String(level)
    if (e.items) {
      level += 0.3
      e.items = setItemsDefaults(e.items, level)
      level -= 0.3
    }
  })
  return items
}
const iconDir = ref('90')
export default {
  directives: { RemoveArrow },
  components: { drawerContent, VFacebookLogin },

  setup () {
    const { handleSdkInit, user: fbUser, model: fbModel, appId } = useFBapi()
    const { loading, isDevEnv, utcDate, getUnityInstance } = useGlobal()
    const { user: googleUser, signedIn: googleSignedIn, signOut: googleSignOut } = useGapi()
    const items = ref([])
    const unityInstance = ref(undefined)
    const callInUnityInstance = (menuIdx) => {
      if (!unityInstance.value) unityInstance.value = getUnityInstance()
      unityInstance.value.Module.asmLibraryArg._SendMenuItemAction(menuIdx)
    }
    const left = ref(false)
    const {
      tryToLogin, loggedIn, user, logout: sessionLogout, isGoogleUser
    } = useSession()
    const logout = () => {
      sessionLogout()
    }
    onBeforeMount(async () => {
      try {
        const isLoggedIn = await tryToLogin()
        if (!isLoggedIn) {
          router.push('login').catch(() => {})
          return
        }
        router.push({ path: 'game', params: { id: '123' } }).catch(() => {})
      } catch (error) {
        console.log('error!!! trying to login in app.vue', error)
      }
    })
    const setItems = () => {
      items.value = setItemsDefaults([
        {
          label: 'Mon profil',
          img: require(`../assets/icons/${iconDir.value}/profileIcon.png`),
          exec: () => { callInUnityInstance(0) }
        },
        {
          label: 'Obtenez des tickets!',
          img: require(`../assets/icons/${iconDir.value}/ticketIcon.png`),
          exec: () => { callInUnityInstance(1) }
        },
        {
          label: 'Cadeaux',
          img: require(`../assets/icons/${iconDir.value}/giftIcon.png`),
          exec: () => { callInUnityInstance(2) }
        },
        {
          label: 'Historique tombola',
          img: require(`../assets/icons/${iconDir.value}/tombolaIcon.png`),
          exec: () => { callInUnityInstance(3) }
        },
        {
          label: 'Collection des cartes',
          img: require(`../assets/icons/${iconDir.value}/cardsIcon.png`),
          exec: () => { callInUnityInstance(4) }
        },
        {
          label: 'Gagnants',
          img: require(`../assets/icons/${iconDir.value}/winnerIcon.png`),
          exec: () => { callInUnityInstance(5) }
        },
        {
          label: 'Configuration',
          img: require(`../assets/icons/${iconDir.value}/settingsIcon.png`),
          exec: () => { callInUnityInstance(6) }
        },
        {
          label: 'Aide',
          img: require(`../assets/icons/${iconDir.value}/helpIcon.png`),
          exec: () => { callInUnityInstance(7) }
        }
      ])
    }
    watch(
      () => Screen.name,
      (gt) => {
        if (gt === 'xs') iconDir.value = '75'
        else if (gt === 'xl') iconDir.value = '100'
        else iconDir.value = '90'
        setItems()
      },
      { immediate: true }
    )
    return {
      logout,
      left,
      items,
      loggedIn,
      user,
      loading,
      isDevEnv,
      utcDate,
      googleUser,
      googleSignedIn,
      isGoogleUser,
      googleSignOut,
      handleSdkInit,
      fbModel,
      appId,
      fbUser
    }
  }
}
</script>

<style lang="scss">
  body{
    font-family: "Titillium Web", 'sans-serif'
  }
  .q-header {
    height: 100px;
    background-color: white;
    @media (max-width: $breakpoint-xs-max){
      height: 50px;
    }
  }
  .q-toolbar{
    height: 100%;
    padding: 30px;
    @media (max-width: $breakpoint-xs-max){
      padding: unset;
      padding-left: 5px;
      padding-right: 0;
      padding-top: 8px;
    }
  }
  .layout-logo-wrapper{
    img{
      max-height: 80px;
      @media (max-width: $breakpoint-xs-max){
        height: 40px;
      }
      }
    // max-width: 310px;
    margin: 10px 10px 15px 0px;
  }
  .btn-user{
    padding-right: 0;
  }
</style>
