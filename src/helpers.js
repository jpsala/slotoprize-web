import { Dialog, Notify } from 'quasar'
import axios from './services/axios'
import useGlobal from './services/useGlobal'
import rfdc from 'rfdc'

function whichBox () {
  const isLocal = document.location.hostname === 'localhost'
  const hostname = document.location.hostname
  const devBoxes = ['portal.dev.slotoprizes.tagadagames.com', 'dev.slotoprizes.tagadagames.com', 'localhost', 'bo.dev.slotoprizes.tagadagames.com']
  const isDev = devBoxes.includes(hostname)
  // @TODO Ver que es este "isLocal"
  return { isDev, isLocal }
}
const debounce = (func, wait, immediate) => {
  let timeout; let args; let context; let timestamp; let
    result
  if (wait == null) wait = 100

  const later = () => {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        // eslint-disable-next-line no-multi-assign
        context = args = null
      }
    }
  }

  function debounced () {
    context = this
    // eslint-disable-next-line prefer-rest-params
    args = arguments
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      // eslint-disable-next-line no-multi-assign
      context = args = null
    }

    return result
  }

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  debounced.flush = () => {
    if (timeout) {
      result = func.apply(context, args)
      // eslint-disable-next-line no-multi-assign
      context = args = null

      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
const throttle = (func, delay) => {
  let inProgress = false
  return (...args) => {
    if (inProgress) {
      return
    }
    inProgress = true
    setTimeout(() => {
      func(...args)
      inProgress = false
    }, delay)
  }
}
const alerta = async (title = 'Alerta', message = '') => new Promise((resolve) => {
  Dialog.create({
    title,
    message
  }).onOk(() => {
    resolve()
  })
})
const confirma = async (title, msg) => {
  return new Promise((resolve) => {
    Dialog.create({
      title: title,
      message: msg,
      persistent: true,
      cancel: {
        label: 'Cancela'
      }
    }).onOk(() => {
      resolve(true)
    }).onCancel(() => {
      resolve(false)
    })
  })
}
const notify = ({
  message = '', error = false, timeout = 3000, icon = ''
} = {}) => {
  Notify.create({
    color: error ? 'red-4' : 'green-4',
    textColor: 'white',
    icon,
    message,
    timeout
  })
}
const rand = (min, max) => {
  const randomNum = Math.random() * (max - min) + min
  return Math.floor(randomNum)
}
const soloEnDevMode = (func) => {
  if (process.env.NODE_ENV === 'development') func()
}
// const log = (...args) => {
//   if (!process.env.NODE_ENV === 'development') return
//   console.warn(...args)
//   console.trace()
// }
const handleAxiosError = (_error) => {
  const error = {}
  if (!_error) error.statusMsg = 'Error'
  else if (_error.data && _error.data.message) error.statusMsg = _error.data.message
  if (_error.status) error.status = _error.status
  return error
}
const elIsVisible = (domElement) => new Promise((resolve) => {
  const o = new IntersectionObserver(([entry]) => {
    resolve(entry.intersectionRatio === 1)
    o.disconnect()
  })
  o.observe(domElement)
})
const resizeObserver = (el, cb) => new ResizeObserver((el) => {
  const entry = el[0]
  const cr = entry.contentRect
  if (!cb) throw new Error('Please pass a callback function')
  cb(cr, el)
  return this
})
export {
  rand, notify, soloEnDevMode, handleAxiosError, elIsVisible, alerta,
  debounce, throttle, resizeObserver, confirma, whichBox
}
export const isNotebook = () => {
  return location.hostname === 'localhost'
}
export const generateAtlas = async (atlasName) => {
  const { showSpinner, hideSpinner } = useGlobal()
  showSpinner()
  const response = await axios.get(`slot/generate_atlas_front?name=${atlasName}`)
  notify({ message: 'Atlas successfully generated' })
  hideSpinner()
  return response
}
export const clone = (data) => {
  return rfdc()(data)
}
