  <template>
    <div ref="unityContainer" id="unity-container" class="unity-desktop">
      <canvas id="unity-canvas" :class="Screen.name === 'xs' ? 'canvas-xs':''"></canvas>
      <div id="unity-loading-bar">
        <div id="unity-logo"></div>
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full"></div>
        </div>
      </div>
      <div id="unity-footer">
        <div id="unity-webgl-logo"></div>
        <div id="unity-fullscreen-button"></div>
      </div>
      <div id="slotoprizes-spin-button"></div>
    </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'
import { Screen } from 'quasar'
const loadGame = true
const buildUrl = 'Build'
const loaderUrl = buildUrl + '/WebGL.loader.js'
const config = {
  dataUrl: buildUrl + '/WebGL.data',
  frameworkUrl: buildUrl + '/WebGL.framework.js',
  codeUrl: buildUrl + '/WebGL.wasm',
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'Tagada Games',
  productName: 'Sloto Prizes',
  productVersion: '1.3.2Dev - 6/1/2021 2:42:54 p. m. UTC.'
}

export default {
  setup () {
    const unityContainer = ref()
    onMounted(() => {
      const container = document.querySelector('#unity-container')
      const canvas = document.querySelector('#unity-canvas')
      const loadingBar = document.querySelector('#unity-loading-bar')
      const progressBarFull = document.querySelector('#unity-progress-bar-full')
      const fullscreenButton = document.querySelector('#unity-fullscreen-button')
      const spinButton = document.querySelector('#slotoprizes-spin-button')

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        container.className = 'unity-mobile'
        config.devicePixelRatio = 1
      } else {
        canvas.style.width = '432px'
        canvas.style.height = '768px'
      }
      loadingBar.style.display = 'block'

      const script = document.createElement('script')
      script.src = loaderUrl
      script.onload = () => {
        if (loadGame) {
          window.createUnityInstance(canvas, config, (progress) => {
            progressBarFull.style.width = 100 * progress + '%'
          }).then((unityInstance) => {
            loadingBar.style.display = 'none'
            fullscreenButton.onclick = () => {
              unityInstance.SetFullscreen(1)
            }
            spinButton.onclick = () => {
              unityInstance.Module.asmLibraryArg._SendSpin()
            }
          }).catch((message) => {
            alert(message)
          })
          if (Screen.gt.sm) unityContainer.value.style.marginTop = '50px'
        }
      }
      document.body.appendChild(script)
    })
    return { Screen, unityContainer }
  }
}

</script>
<style lang="scss">
#unity-container{
  display: flex;
  justify-content: center;
  &.lt-sm{
    margin-top: 50px
  }
  #unity-canvas{
    border-radius: 5px;
    .canvas-xs{
      width: 100%;
    }
  }
}
</style>
