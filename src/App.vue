<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
console.warn('app.vue')
import './services/composition-api'
export default {
  name: 'App'
}
</script>
