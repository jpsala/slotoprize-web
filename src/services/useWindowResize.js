/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
import { onMounted, onUnmounted, onBeforeMount, reactive, toRefs } from '@vue/composition-api'
import { throttle } from '../helpers'

const Screen = reactive(
  { lt: { sm: false, md: false, lg: false, xl: false },
    gt: { xs: false, sm: false, md: false, lg: false },
    name: '',
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    width: 0 })
const setScreenValues = (data) => {
  console.log('data', data)
  if (!data) {
    return
  }
  let target = data
  if (data.target) {
    target = data.target
  }
  Screen.X = target.ScreenX
  Screen.Y = target.ScreenY
  Screen.width = target.innerWidth
  if (target.innerWidth < 600) {
    Screen.name = 'xs'
    Screen.xs = true
    Screen.sm = false
    Screen.md = false
    Screen.lg = false
    Screen.xl = false
    Screen.lt.sm = true
    Screen.lt.md = true
    Screen.lt.lg = true
    Screen.lt.xl = true
    Screen.gt.xs = false
    Screen.gt.sm = false
    Screen.gt.md = false
    Screen.gt.lg = false
    Screen.gt.xl = false
  } else if (target.innerWidth < 1024) {
    Screen.name = 'sm'
    Screen.xs = false
    Screen.sm = true
    Screen.md = false
    Screen.lg = false
    Screen.xl = false
    Screen.lt.sm = false
    Screen.lt.md = true
    Screen.lt.lg = true
    Screen.lt.xl = true
    Screen.gt.xs = true
    Screen.gt.sm = false
    Screen.gt.md = false
    Screen.gt.lg = false
    Screen.gt.xl = false
  } else if (target.innerWidth < 1440) {
    Screen.name = 'md'
    Screen.xs = false
    Screen.sm = false
    Screen.md = true
    Screen.lg = false
    Screen.xl = false
    Screen.lt.sm = false
    Screen.lt.md = false
    Screen.lt.lg = true
    Screen.lt.xl = true
    Screen.gt.xs = true
    Screen.gt.sm = true
    Screen.gt.md = false
    Screen.gt.lg = false
    Screen.gt.xl = false
  } else {
    Screen.name = 'xl'
    Screen.xs = false
    Screen.sm = false
    Screen.md = false
    Screen.lg = false
    Screen.xl = true
    Screen.lt.sm = false
    Screen.lt.md = false
    Screen.lt.lg = false
    Screen.lt.xl = false
    Screen.gt.xs = true
    Screen.gt.sm = true
    Screen.gt.md = true
    Screen.gt.lg = true
    Screen.gt.xl = false
  }
  console.log('width', Screen.width)
}
export default () => {
  let windowResize
  // const screen = computed(() => Screen, { deep: true })
  onBeforeMount(() => setScreenValues(window))
  onMounted(() => {
    windowResize = (e) => setScreenValues(e.target)
    setScreenValues(window)
    window.addEventListener('resize', throttle(windowResize, 500))
  })
  onUnmounted(() => {
    window.removeEventListener('resize', throttle(windowResize, 500))
  })
  return { ...toRefs(Screen) }
}
