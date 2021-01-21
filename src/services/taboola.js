export default function init () {
  window._taboola = window._taboola || []
  window._taboola.push([
    { flush: true },
    { article: 'auto' }]
  )
  // eslint-disable-next-line no-unused-expressions
  !(function (e, f, u, i) {
    if (!document.getElementById(i)) {
      e.async = 1
      e.src = u
      e.id = i
      f.parentNode.insertBefore(e, f)
    }
  }(
    document.createElement('script'),
    document.getElementsByTagName('script')[0],
    '//cdn.taboola.com/libtrc/tagadamedia-slotoprizes/loader.js', 'tb_loader_script'
  ))

  if (window.performance && typeof window.performance.mark === 'function') {
    window.performance.mark('tbl_ic')
  }

  window._taboola.push({
    mode: 'thumbnails-a',
    container: 'taboola-below-article-thumbnails',
    placement: 'Below Article Thumbnails',
    target_type: 'mix'
  })
}
