<template>
  <div v-if="data" id="winners">

      <div v-for="row in data" :key="row.id" class="winner shadow-4 row">
        <div class="left col">
          <div class="prize">{{row.prize}}</div>
          <div v-show="row.player.lastName || row.player.firstName" class="user">Won by {{row.player.lastName}} {{row.player.firstName}}</div>
          <div class="date">{{row.date}}</div>
        </div>
        <div class="right col-auto">
          <q-img :src="row.textureUrl" />
        </div>
      </div>
  </div>
</template>
<script>
import useSession from '../services/useSession'
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import axios from '../services/axios'

const state = reactive({
  data: undefined,
  email: undefined,
  emailExpansion: false,
  password: undefined,
  password2: undefined,
  passwordExpansion: false,
  user: {}
})
export default {
  setup () {
    const { user, loggedIn } = useSession()
    onMounted(async () => {
      if (!loggedIn.value) return
      console.log('detalle', loggedIn, JSON.stringify(user.value, null, 2))
      const response = await axios.get('/portal/portal_winners')
      state.data = response.data
    })
    return { ...toRefs(state) }
  }
}

</script>
<style lang="scss">
#winners{
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  align-items: center;
  .winner{
    padding: 28px;
    border-radius: 5px;
    width: 800px;
    margin-bottom: 20px;
    .left{
      padding-right: 50px;
      .prize{
        font-size: 1rem;
        font-weight: bold;
      }
      .user{ margin: 10px 0 }
      .date{margin: 10px 0}
    }
    .right{
      justify-self: end;
      .q-img{width: 200px;}
    }
  }
}
</style>
