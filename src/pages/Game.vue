<template>
  <div class="game">

    <loading3 v-show="loadGame && isGameRoute"/>

    <div v-show="isGameRoute" ref="unityContainer" id="unity-container" class="unity-desktop">
      <div class="colum canvas-wraper">
        <div v-if="!loadGame"><q-img width="100vw" src="../assets/game_replace.png"/></div>
        <canvas v-if="loadGame" id="unity-canvas" :class="Screen.name === 'xs' ? 'canvas-xs':''"></canvas>
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div id="unity-progress-bar-full"></div>
          </div>
        </div>
        <div ref="buttonsRow" class="row buttons-row">
          <q-btn rounded class="multiplier-btn col bg-blue-8 text-white" :label="`X${actualMultiplier}`" @click="setMultiplier" />
          <q-btn rounded class="spin-btn col bg-red-10 text-white" label="Spin" @click="spin"/>
        </div>
      </div>
      <q-linear-progress v-show="progress < 1" style="width:100%" stripe size="10px" :value="progress" />
    </div>

    <div v-show="!isGameRoute" class="content">
      <router-view />
    </div>

    <div v-show="loggedIn && isGameRoute" class="ads">
      <div id="taboola-below-article-thumbnails"></div>
    </div>

  </div>
</template>

<script>

import { onMounted, ref, computed, watch } from '@vue/composition-api'
import { Screen } from 'quasar'
import { isNotebook, whichBox } from '../helpers'
import useGlobal from '../services/useGlobal'
import useSloto from '../services/useSloto'
import useSession from '../services/useSession'
import taboolaInit from '../services/taboola'
const { user, loggedIn } = useSession()
const { actualMenu } = useSloto()
const { isDev, isLocal } = whichBox()
const { setUnityInstance, loadingText } = useGlobal()
loadingText.value = true

const actualMultiplier = ref()

let buildUrl
if (isLocal) buildUrl = 'https://root.slotoprizes.tagadagames.com/public/assets/web_build_params/Build'
else if (isDev) buildUrl = 'https://assets.dev.slotoprizes.tagadagames.com/web_build_params/Build'
else buildUrl = 'https://root.slotoprizes.tagadagames.com/public/assets/web_build_live/Build'

const fileName = (isLocal || isDev) ? 'WebGL' : 'WebGL'
const loaderUrl = `${buildUrl}/${fileName}.loader.js`

const config = {
  dataUrl: `${buildUrl}/${fileName}.data.gz`,
  frameworkUrl: `${buildUrl}/${fileName}.framework.js.gz`,
  codeUrl: `${buildUrl}/${fileName}.wasm.gz`,
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'Tagada Games',
  productName: 'Sloto Prizes',
  productVersion: '1.3.2Dev - 6/1/2021 2:42:54 p. m. UTC.'
}
const loadGame = ref(true)
const unityContainer = ref()
const progress = ref(0)
const buttonsRow = ref()
let unityInstance

if (isNotebook) loadGame.value = true

const setMultiplier = () => {
  unityInstance.Module.asmLibraryArg._SendMultiplierUpdate()
  const actualGameMultiplier = unityInstance.Module.asmLibraryArg._GetMultiplier()
  actualMultiplier.value = actualGameMultiplier
  // actualMultiplier.value = (actualMultiplier.value === maxMultiplier.value) ? 1 : actualMultiplier.value + 1
}

const spin = () => {
  unityInstance.Module.asmLibraryArg._SendSpin()
}

const loadUnityInstance = () => {
  if (!loadGame.value) return

  const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname +
            `?id=${user.value.deviceId}&email=${user.value.email}&name=${user.value.name}`
  window.history.pushState({ path: newurl }, '', newurl)
  const canvas = document.querySelector('#unity-canvas')

  const script = document.createElement('script')
  script.src = loaderUrl
  console.log('script.src', loaderUrl)
  script.onload = () => {
    console.log('onload')
    window.createUnityInstance(canvas, config, (_progress) => {
      console.log('progress.value', progress.value)
      progress.value = Number(_progress)
    }).then((_unityInstance) => {
      unityInstance = _unityInstance
      actualMultiplier.value = unityInstance.Module.asmLibraryArg._GetMultiplier()
      setUnityInstance(_unityInstance)
      buttonsRow.value.style.display = 'flex'
      setTimeout(() => {
        loadingText.value = false
        const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname
        window.history.pushState({ path: newurl }, '', newurl)
      }, 3000)
    }).catch((message) => {
      alert(message)
    })
  }
  document.body.appendChild(script)
}
watch(() => loggedIn.value, (loggedIn) => {
  if (!unityInstance && loggedIn) {
    console.warn('game watch loggedIn loadUnityInstance()')
    loadUnityInstance()
  }
}, { inmediate: true })

export default {
  setup (_, { root }) {
    const isGameRoute = computed(() => root.$route.path === '/game')
    onMounted(() => {
      taboolaInit()
      if (!unityInstance && loggedIn.value) {
        loadUnityInstance()
      }
    })

    return {
      Screen,
      unityContainer,
      spin,
      loadGame,
      progress,
      buttonsRow,
      setMultiplier,
      actualMultiplier,
      loggedIn,
      actualMenu,
      user,
      isGameRoute
    }
  }
}

</script>
<style lang="scss">
.game{
  // background-color: #F3F4F9;
  .ads{
    // display: none;
    padding: 30px 20px 0 20p;
    width: 1280px;
    @media (max-width: $breakpoint-xl-max){
      padding: 10px 10px 0 10px;
      width: 1680px;
    }
    @media (max-width: $breakpoint-md-max){
      width: 90%;
    }
    @media (max-width: $breakpoint-xs-max){
      padding: 10px 10px 0 10px;
      width: 100%;
    }
    margin: auto;
  }
  #unity-container{
    display: flex;
    justify-content: center;
    .canvas-wraper{
        flex-grow: 1;
      #unity-canvas{
        height: 500px;;
        width: 100%;
          .canvas-xs{
            width: 100%;
          }
        }
      }
  }
  .buttons-row{
    justify-content: center;
    margin: auto;
    display: none;
    .spin-btn, .multiplier-btn{
      margin-top: 10px;
    }
    .multiplier-btn{
      max-width: 110px;
      margin-right: 20px;
      @media (max-width: $breakpoint-xs-max){
        width: 100%;
        margin-right: 10px;
      }
    }
    .spin-btn{
      max-width: 220px;
    }
  }
}
</style>
