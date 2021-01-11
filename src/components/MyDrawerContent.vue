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
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
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

export default {
/* eslint-disable no-underscore-dangle */
  name: 'MyDrawerContent',
  props: { items: null, label: null },

  setup () {
    // const store = ctx.root.$store;
    const allowedItem = (item) => !item.protected || (item.protected && true)
    const exec = (e) => {
      if (e.exec) {
        e.exec(e)
      }
    }
    return { allowedItem, exec }
  }

}
</script>
