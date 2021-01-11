<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)

export default {
  name: 'App'
}
</script>
