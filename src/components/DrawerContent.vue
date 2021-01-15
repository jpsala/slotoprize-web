<template>
  <div>
    <template v-for="(item, index) in items">
      <template>
        <!-- es un item -->
        <q-item
          exact
          v-if="!item.items"
          :key="index"
          :inset-level="item.level"
          :to="item.to"
          style="cursor: pointer"
          @click.native="exec(item)"
        >
          <!-- <q-item-section> -->
          <div :style="`width: ${Screen.name==='xs' ? '45px':'50px'}`">
            <q-icon v-if="item.icon" :name="item.icon" />
            <img v-if="item.img" :src="item.img" />
          </div>
          <!-- </q-item-section> -->
          <q-item-section><span :class="xs ? 'item-span-xs':'item-span'"> {{ item.label }}</span></q-item-section>
        </q-item>
        <!-- es un submenú -->
        <q-expansion-item
          v-else
          :key="index"
          :icon="item.icon"
          :label="item.label"
          :default-opened="item.open"
          :group="item.group"
          :data-class="item.label"
          :header-inset-level="item.icon ? item.level : item.level + 1"
        >
          <my-drawer-content
            :items="item.items"
            :label="item.label"
          />
        </q-expansion-item>
      </template>
    </template>
  </div>
</template>
<script>
// import { ref } from '@vue/composition-api'
// import Vue from 'vue'
import { Screen } from 'quasar'
import { computed } from '@vue/composition-api'

export default {
/* eslint-disable no-underscore-dangle */
  name: 'DrawerContent',
  props: { items: null, label: null },

  setup (_, { emit }) {
    // const store = ctx.root.$store;
    const allowedItem = (item) => !item.protected || (item.protected && true)
    const xs = computed(() => Screen.name === 'xs')
    const exec = (e) => {
      if (e.exec) {
        emit('close')
        setTimeout(() => {
          e.exec(e)
        }, 10)
      }
    }
    return { allowedItem, exec, Screen, xs }
  }

}
</script>
<style lang="scss">
.item-span{
  font-size: 1.1rem;
  color: #6783F8;
  margin-left: 15px;
}
.item-span-xs{
  font-size: 0.8rem;
  color: #6783F8;
  margin-left: 10px;
}
</style>
