import { computed, reactive, watch, toRefs } from '@vue/composition-api'
// import { zonedTimeToUtc } from 'date-fns-tz'
import {
  Loading,
  QSpinnerDots
} from 'quasar'
import { whichBox } from 'src/helpers'
const state = reactive({
  loading: false,
  spinner: false,
  utcDate: new Date(),
  isDevEnv: whichBox().isDev
})
const url = new URL(location.href)
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
console.log('url', url.origin)
console.log('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone)
setInterval(() => {
  state.isDevEnv = whichBox().isDev
  const utcDate = new Date().toUTCString()
  state.utcDate = utcDate// zonedTimeToUtc(utcDate, timeZone)
}, 1000)
const useGlobal = () => {
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
  return { ...toRefs(state), startLoading, stopLoading, loading, showSpinner, hideSpinner, isDevEnv }
}
export default useGlobal
