/* eslint-disable no-underscore-dangle */
// non-angular-link-directive.js
// import Vue from 'vue'
import { elIsVisible } from '../helpers'

export const RemoveArrow = {
  async inserted (el) {
    elIsVisible(el).then(() => {
      const arrowEl = el.querySelector('.q-btn-dropdown__arrow-container')
      arrowEl.remove()
    })
  }
}
