<template>
  <div class="q-gutter-md">
      <q-select
        v-model="model"
        use-input
        hide-selected
        fill-input
        label="Country"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        option-label="name"
        option-value="code"
        hint="With hide-selected and fill-input"
        @input="valChanged"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
</template>

<script>
import { getCountries } from '../helpers'
import { reactive, toRefs } from '@vue/composition-api'
const state = reactive({
  countries: [],
  model: null,
  options: []
})
export default {
  props: {
    country: {}
  },
  setup (props, { emit }) {
    console.log('country', props.country)
    const _country = getCountries().find(v => v.name === props.country.name)
    if (_country) state.model = _country
    function valChanged (val) {
      emit('change', val)
    }
    function filterFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow

      update(() => {
        if (val === '') {
          state.options = getCountries()
        } else {
          const needle = val.toLowerCase()
          state.options = getCountries().filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        }
      })
    }

    function abortFilterFn () {
      // console.log('delayed filter aborted')
    }
    return { ...toRefs(state), filterFn, abortFilterFn, valChanged }
  }
}
</script>

<style>

</style>
