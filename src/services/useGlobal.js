import { computed, reactive, watch, toRefs, ref } from '@vue/composition-api'
import { Loading, QSpinnerDots } from 'quasar'
import { whichBox } from 'src/helpers'

const state = reactive({
  loading: false,
  spinner: false,
  utcDate: new Date(),
  isDevEnv: whichBox().isDev,
  unityInstance: ref(undefined)
})

setInterval(() => {
  state.isDevEnv = whichBox().isDev
  const utcDate = new Date().toUTCString()
  state.utcDate = utcDate// zonedTimeToUtc(utcDate, timeZone)
}, 1000)

const setUnityInstance = (instance) => {
  state.unityInstance = instance
}
const getUnityInstance = () => {
  return state.unityInstance
}

// const isDev = computed(() => state.isDev)
const startLoading = () => {
  state.loading = true
}
const stopLoading = () => {
  state.loading = false
}
const showSpinner = () => {
  state.spinner = true
}
const hideSpinner = () => {
  state.spinner = false
}
// const utcDate = computed(() => {

// })
const loading = computed(() => {
  return state.loading
})
const isDevEnv = computed(() => {
  return state.isDevEnv
})
watch(() => state.spinner, (value) => {
  if (value) Loading.show({ spinner: QSpinnerDots })
  else Loading.hide()
})
const useGlobal = () => {
  return {
    ...toRefs(state),
    startLoading,
    stopLoading,
    loading,
    showSpinner,
    hideSpinner,
    isDevEnv,
    setUnityInstance,
    getUnityInstance
  }
}
export default useGlobal
