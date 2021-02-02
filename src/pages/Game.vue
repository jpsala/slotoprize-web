<template>
  <div class="game">
    <div v-show="!isGameRoute" class="header">
      <span class="title">{{title}}</span>
      <img :src="require('../assets/logo2.png')" />
    </div>
    <div v-show="!isGameRoute" class="router-view">
      <router-view />
    </div>

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
        <div id="google-add"></div>
        <div ref="buttonsRow" class="row buttons-row" style="align-items: start;">
          <q-btn rounded class="multiplier-btn col bg-blue-8 text-white" :label="`X${actualMultiplier}`" @click="setMultiplier" />
          <q-btn rounded class="spin-btn col bg-red-10 text-white" label="Spin" @click="spin"/>
        </div>
      </div>
      <q-linear-progress v-show="progress < 1" style="width:100%" stripe size="10px" :value="progress" />
    </div>

    <div v-show="loggedIn && isGameRoute" class="ads">
      <div id="taboola-below-article-thumbnails"></div>
    </div>

  </div>
</template>

<script>

import { onMounted, ref, watch, watchEffect } from '@vue/composition-api'
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
// import { loadAdSenseScript } from '../services/adsbygoogle'
loadingText.value = true

const actualMultiplier = ref()

let buildUrl
if (isLocal) buildUrl = 'https://assets.dev.slotoprizes.tagadagames.com/web_build_params/Build'
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
const title = ref('')
let unityInstance

if (isNotebook) loadGame.value = false

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
      const senseWrapper = document.getElementById('mys-wrapper')
      console.log('sw', senseWrapper)
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
    const isGameRoute = ref(false)
    watchEffect(() => {
      if (root.$route.path === '/game') isGameRoute.value = true
      else isGameRoute.value = false
      if (root.$route.path === '/game/profile') title.value = 'Mon profile'
      if (root.$route.path === '/game/winners') title.value = 'Ils ont gagné sur slotoprizes'
      if (root.$route.path === '/game/raffles') title.value = 'Cadeaux'
    })
    onMounted(async () => {
      // const adsbygoogle = await loadAdSenseScript()
      // const respAds = adsbygoogle.push({/*  google_ad_client: 'ca-pub-6174806814869296' */ })
      // console.log('respAds', respAds)
      taboolaInit()
      if (!unityInstance && loggedIn.value) {
        loadUnityInstance()
      }
      const ads = document.querySelector('.adsbygoogle')
      const ad = document.getElementById('google-add')
      ad.innerHTML = ads.innerHTML
      console.log('ads', ads)
      ads.style.display = 'none'
    })
    watch(() => isGameRoute.value, (val) => {
      const originalAd = document.querySelector('.adsbygoogle')
      const target = document.getElementById('google-add')
      target.innerHTML = originalAd.innerHTML
      originalAd.style.display = 'none'
      // if (ads) ads.style.display = val ? 'block' : 'none'
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
      isGameRoute,
      title
    }
  }
}

</script>
<style lang="scss">
#google-add{
  align-self: center;
  margin-bottom: -9px;
  margin-top: 12px;
}
.adsbygoogle{
  position: fixed;
  bottom: 0px;
  left: 50%;
  margin-left: -364px;
  width: 728px;
  z-index: 222;
  // height: 207px!important;
}
.header {
  position: relative;
  height: 210px;
  margin: 5px auto;
  background-color: #384CAD;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (max-width: $breakpoint-xs-max){ height: 110px;}
  .title{
    font-size: 3rem;
    font-weight: bolder;
    position: absolute;
    top: calc(35% - 10px);
    left: calc(10%);
    color: white;
    margin: auto;
    @media (max-width: $breakpoint-lg-max){ font-size: 2.2rem; top: calc(50% - 1.5rem); left: 100px}
    @media (max-width: $breakpoint-md-max){ font-size: 2rem; top: calc(50% - 1.5rem); left: 80px}
    @media (max-width: $breakpoint-sm-max){ font-size: 1.6rem; top: calc(50% - 1.5rem); left: 20px}
    @media (max-width: $breakpoint-xs-max){ font-size: 1rem; top: calc(42% - 10px);left: 20px}
  }
  img{
    align-self: center;
    height:100%;
    @media (max-width: $breakpoint-md-max){
      // margin-right: -40px;
      // margin-top: 45px;
      // height: 60%;
      // margin: auto;
    }
    @media (max-width: $breakpoint-sm-max){
      // margin-right: -80px;
      // margin-top: 10px;
      // width: 750px;
    }
    @media (max-width: $breakpoint-xs-max){
      // margin-right: -40px;
      // margin-top: 20px;
      // width: 300px;
    }
  }
}
.game{
  /* background-color: #fff; */
  width: 100%;
  position: relative;
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
        display: flex;
        flex-direction: column;
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
    width: 100%;
    .spin-btn, .multiplier-btn{
      margin-top: 10px;
      margin: 10px;
    }
    .spin-btn{margin-left: 15px}
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
