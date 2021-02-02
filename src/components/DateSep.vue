<template>
  <div class="date-sep">
    <span class="date-sep-label" v-if="label">{{label}}</span>
    <q-select dense outlined class="day" v-model="day" :options="days"/>
    <q-select dense outlined class="month" v-model="month" :options="months"/>
    <q-select dense outlined class="year" v-model="year" :options="years"/>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
export default {
  props: {
    date: {
      default: new Date(),
      type: [Date, String]
    },
    label: undefined
  },
  setup (props, { emit }) {
    const state = reactive({
      day: undefined,
      month: undefined,
      year: undefined
    })
    let _date = props.date
    if (typeof (props.date) === 'string') {
      _date = new Date(props.date)
    }
    const thisYear = (new Date()).getFullYear()
    state.days = []
    state.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    state.years = []
    for (let index = 1; index <= 31; index++) state.days.push(index)

    for (let index = 1900; index <= thisYear; index++) state.years.push(index)
    state.day = _date.getDate()
    state.month = state.months[_date.getMonth()]
    state.year = _date.getFullYear()
    watch([() => state.day, () => state.month, () => state.year], () => {
      const month = state.months.findIndex(val => val === state.month)
      const date = new Date(state.year, month, state.day)
      emit('change', date)
    })
    return { ...toRefs(state) }
  }
}
</script>

<style lang="scss">
.date-sep{
  width: auto;
  padding-top: 24px;
  padding-bottom: 8px;
  display: flex;
  .date-sep-label{
    align-self: center;
    margin-right: 5px;
  }
  .q-select{
    display: inline-block;
  }
  .day{
    width: 70px;
  }
  .month{
    width: 100px;
  }
  .year{
    width: 100px;
  }
}
</style>
