  <template>
  <div class="game">
    <loading3 />
    <div ref="unityContainer" id="unity-container" class="unity-desktop">
      <div class="colum canvas-wraper">
        <div v-if="!loadGame"><q-img src="../assets/game_replace.png"/></div>
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
    </div>
    <q-linear-progress v-show="progress < 1" style="width:100%" stripe size="10px" :value="progress" />
    <div class="ads">
      <div class="row">
        <div class="col ad"><q-img src="../assets/ad1.png"/></div>
      </div>
      <div class="row">
        <div class="col ad"><q-img src="../assets/ad2.png"/></div>
      </div>
    </div>
  </div>
</template>

<script>

import { onMounted, ref } from '@vue/composition-api'
import { Screen } from 'quasar'
import { isNotebook, whichBox } from '../helpers'
import useGlobal from '../services/useGlobal'
// import useSloto from '../services/useSloto'
import useSession from '../services/useSession'

console.log('whichBox', whichBox)
export default {
  setup (_, { root }) {
    const { user, loggedIn } = useSession()
    // const { maxMultiplier } = useSloto()
    const { isDev, isLocal } = whichBox()
    const { setUnityInstance, loadingText } = useGlobal()

    loadingText.value = true

    const actualMultiplier = ref()

    let buildUrl
    if (isLocal) buildUrl = 'https://assets.dev.slotoprizes.tagadagames.com/web_build_params/Build'
    else if (isDev) buildUrl = 'https://assets.dev.slotoprizes.tagadagames.com/web_build_params/Build'
    else buildUrl = 'https://portal.slotoprizes.tagadagames.com/web_build_live/Build/'
    // else buildUrl = 'https://assets.slotoprizes.tagadagames.com/web_build_live/Build'

    const fileName = (isLocal || isDev) ? 'WebGL' : 'web_build_live'
    const loaderUrl = `${buildUrl}/${fileName}.loader.js`
    const gz = (isLocal || isDev)
    const config = {
      dataUrl: `${buildUrl}/${fileName}.data${gz ? '.gz' : ''}`,
      frameworkUrl: `${buildUrl}/${fileName}.framework.js${gz ? '.gz' : ''}`,
      codeUrl: `${buildUrl}/${fileName}.wasm${gz ? '.gz' : ''}`,
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'Tagada Games',
      productName: 'Sloto Prizes',
      productVersion: '1.3.2Dev - 6/1/2021 2:42:54 p. m. UTC.'
    }
    console.log('unity config', config)
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
      const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname +
            `?id=${user.value.deviceId}&email=${user.value.email}&name=${user.value.name}`
      window.history.pushState({ path: newurl }, '', newurl)
      const canvas = document.querySelector('#unity-canvas')

      const script = document.createElement('script')

      if (loadGame.value) {
        script.src = loaderUrl
        script.onload = () => {
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
            }, 3000)
          }).catch((message) => {
            alert(message)
          })
        }
        document.body.appendChild(script)
      }
    }

    // watch(() => loggedIn.value, (loggedIn) => {
    //   if (!unityInstance && loggedIn) {
    //     console.warn('game watch loggedIn loadUnityInstance()')
    //     loadUnityInstance()
    //   }
    // }, { inmediate: true })

    onMounted(() => {
      if (!unityInstance && loggedIn.value) {
        console.warn('game onMounted loggedIn loadUnityInstance()')
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
      actualMultiplier
    }
  }
}

</script>
<style lang="scss">
.game{
  background-color: #F3F4F9;
  .ads{
    padding-top: 30px;
    width: 800px;
    @media (max-width: $breakpoint-xs-max){
      width: 100%;
    }
    margin: auto;
    .ad{
      margin: auto;
      width: 1024px !important;
      max-width: 90vw !important;
    }
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
