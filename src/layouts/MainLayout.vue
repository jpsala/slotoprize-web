<template>
  <q-layout view="hHh lpR fFf">
    <q-ajax-bar size="2px" />
    <q-header
      elevated
      class="isDevEnv ? 'bg-secondary text-subtitle1':''"
    >
      <q-toolbar>
        <!-- <q-btn
          dense
          flat
          round
          icon="menu"
          @click.stop="left = !left"
        /> -->
        <q-toolbar-title>
          <q-avatar style="width: 50px; height: 55px">
            <q-img
              src="../assets/SlotoPrizesRoundLogo.png"
              spinner-color="primary"
              spinner-size="82px"
            />
            <!-- <div class="text-subtitle1">
              Wopidom
            </div> -->
          </q-avatar>
        </q-toolbar-title>
        <!-- <span
          v-show="isDevEnv"
          class="q-mr-md"
          style="color:#ffeb3bcf; font-size: 100%"
        >DevMode!</span> -->
        <span
          class="q-mr-md"
          style="color:white; font-size: 110%"
        ><!-- UTC Date {{ utcDate }} --></span>
        <q-btn
          v-if="$route.path !== '/login' && !loggedIn"
          flat
          @click="$router.push('/login')"
        >
          <span>Ingreso/Registro</span>
        </q-btn>
        <!-- profile menu , ya ingresó-->
        <q-spinner-tail
          v-show="loading"
          color="white"
          size="2em"
        />
        <q-btn-dropdown
          v-if="loggedIn"
          id="profile-btn"
          ref="profileBtn"
          v-remove-arrow
          icon="person"
          rounded
          unelevated
          :label="user.firstName"
        >
          <q-list style="width: 180px">
            <q-item
              v-close-popup
              v-ripple
              clickable
            >
              <q-item-section side>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section @click="logout">
                Cerrar Sesión
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="left"
      :breakpoint="800"
      :width="260"
      side="left"
      bordered
      no-swipe-close
    >
      <q-list class="rounded-borders">
        <my-drawer-content
          v-if="loggedIn"
          :items="items"
        />
        <!-- <q-item
          v-if="loggedIn"
          exact
          style="cursor: pointer"
          @click.native="logout()"
        >
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
    </q-layout>
</template>

<script>
import { ref, onBeforeMount } from '@vue/composition-api'
import { RemoveArrow } from 'app/src/components/RemoveArrowDirective'
import myDrawerContent from 'app/src/components/MyDrawerContent'
import useSession from '../services/useSession'
import useGapi from '../services/useGapi'
import useGlobal from '../services/useGlobal'
import { router } from '../boot/router'

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
export default {
  directives: { RemoveArrow },
  components: { myDrawerContent },

  setup () {
    const { loading, isDevEnv, utcDate } = useGlobal()
    const { user: googleUser, signedIn: googleSignedIn, onUserChanged, signOut: googleSignOut } = useGapi()
    console.log('ouc', onUserChanged)
    const items = ref(
      setItemsDefaults([
        {
          label: 'Home',
          icon: 'home',
          to: '/'
        },
        {
          label: 'Games',
          icon: 'build',
          open: true,
          items: [
            { label: 'Games', to: '/games' }

          ]
        }
      ])
    )

    const left = ref(false)
    const {
      tryToLogin, loggedIn, user, logout: sessionLogout, isGoogleUser
    } = useSession()
    // nextTick(() => { left.value = false })
    const logout = () => {
      sessionLogout()
    //   if (root.$route.path !== '/login') root.$router.push('/login');
    }
    onBeforeMount(async () => {
      try {
        const isLoggedIn = await tryToLogin()
        if (!isLoggedIn) {
          router.push('login').catch(() => {})
          return
        }
        router.push('game').catch(() => {})
      } catch (error) {
        console.log('error!!! trying to login in app.vue', error)
      }
    })
    return {
      logout, left, items, loggedIn, user, loading, isDevEnv, utcDate, googleUser, googleSignedIn, isGoogleUser, googleSignOut
    }
  }
}
</script>
