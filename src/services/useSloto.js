import { computed, reactive, ref, toRefs } from '@vue/composition-api'

const maxMultiplier = ref(1)
const state = reactive({
  maxMultiplier: computed({
    value: 1,
    get: () => maxMultiplier.value,
    set: (_multiplier) => { maxMultiplier.value = _multiplier }
  })
})

const useSloto = () => {
  return { ...toRefs(state) }
}

export default useSloto
