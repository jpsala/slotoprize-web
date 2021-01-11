<template>
  <!-- <div class="game row q-gutter-md justify-center shadow-4 self-center"> -->
    <q-card class="my-card">
      <!-- <pre v-if="user && user.id">user: {{iframeSrc+'/#/game?id='+user.gameUserId}}</pre> -->
      <!-- <pre>{{user}}</pre> -->
      <h4 v-show="!loaded" class="loading">Loading...</h4>
      <!-- <iframe v-show="loaded" :load="iframeLoaded()" src="https://bo.dev.slotoprizes.tagadagames.com/joke.html" frameborder="0"></iframe> -->
      <iframe v-if="user && user.deviceId" id="iframe-id" v-show="loaded" :load="iframeLoaded()"
              :src="`${iframeSrc}?id=${user.deviceId}&name=${user.firstName}&email=${user.email}`" frameborder="0"></iframe>
      <q-btn ref="mySpinButton" class="spin-button" color="primary" icon="check" label="Spin"
             @click="spinButton.click()" />
      <q-separator />
    </q-card>
  <!-- </div> -->
</template>
<script>
import { reactive, toRefs, ref, onMounted } from '@vue/composition-api'
import { whichBox } from 'src/helpers'
import useSession from '../services/useSession'

export default {
  setup () {
    const { user } = useSession()
    let removeFooterInterval
    const spinButton = ref(undefined)
    const mySpinButton = ref(undefined)
    const spinButtonLoaded = ref(false)
    const { isLocal } = whichBox()
    const state = reactive({
      loaded: false,
      iframeSrc: isLocal
        // ? 'http://localhost:8888/web_build/index.html'
        ? 'https://portal.dev.slotoprizes.tagadagames.com/web_build_params/index.html'
        : 'https://portal.dev.slotoprizes.tagadagames.com/web_build_params/index.html'
    })
    const iframeLoaded = () => {
      console.log('loaded')
      if (state.loaded) return
      state.loaded = true
      if (!isLocal) {
        removeFooterInterval = setInterval(() => removeFooter(), 1000)
        removeFooter()
      }
      mySpinButton.value.$el.style.display = 'block'
    }
    const removeFooter = () => {
      const iframe = document.getElementById('iframe-id')
      if (!iframe) return
      const innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document
      const footerEl = innerDoc.getElementById('unity-footer')
      spinButton.value = innerDoc.querySelector('#slotoprizes-spin-button')
      console.log('spinButton', spinButton)
      spinButton.value.style.display = 'none'
      console.log('spinButton', spinButton, innerDoc)
      spinButtonLoaded.value = true
      console.log('spinbutton', spinButton.value, spinButton.value.click)
      if (footerEl) footerEl.style.display = 'none'
      if (footerEl) clearInterval(removeFooterInterval)
    }
    onMounted(() => {
      console.warn('myspin', mySpinButton.value.$el.style.display = 'block')
      // mySpinButton.value.style.display = 'block'
    })
    return { ...toRefs(state), iframeLoaded, isLocal, user, spinButton, mySpinButton }
  }

}
</script>
<style>
  #page-container{
    height: 99.3vh;
    width: 100vw;
  }
</style>
<style lang="scss" scoped>
  .spin-button{
    // position: absolute;
    // top: 589px;
    // left: 516px;
    width: 114px;
    height: 42px;
    display: none;
    width: 100%;
  }
  .q-card{
    background-color: white;
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
  }
  .game{
    width: 100%;
    height: 100%;
  }
  iframe{
    zoom: 0.5!important;
    align-self: center;
    margin:auto;
    width: 90%;
    height: 95%;
  }
</style>
