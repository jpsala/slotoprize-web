export function loadAdSenseScript () {
  return new Promise(function (resolve, reject) {
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    script.onreadystatechange = script.onload = function () {
      // const interval = setTimeout(function () {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        // clearTimeout(interval)
        if (window.adsbygoogle) {
          resolve(window.adsbygoogle)
        } else {
          console.warn('loadAdSenseScript error')
          reject()
        }
      }
      // }, 100)
    }
    script.onerror = function (message, url, line, column, error) {
      reject({ message: message, url: url, line: line, column: column, error: error })
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
