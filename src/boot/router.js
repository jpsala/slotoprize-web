/* eslint-disable import/no-mutable-exports */
console.warn('boot router')
let router
export default async ({ router: _router }) => {
  router = _router
}
export { router }
