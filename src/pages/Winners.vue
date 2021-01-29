<template>
  <div>
    <div class="winners-header">
      <div class="title">They won on Primolotto</div>
      <!-- <q-img src="./" -->
    </div>
    <div v-if="data" id="winners">
        <div v-for="row in data" :key="row.id" class="winner shadow-4 row">
          <div class="left col">
            <div class="prize">{{row.prize}}</div>
            <div v-show="row.player.lastName || row.player.firstName" class="user">Won by {{row.player.lastName}} {{row.player.firstName}}</div>
            <div class="date">{{row.date}}</div>
          </div>
          <div class="col-auto" style="align-self: normal;">
            <div class="separator"></div>
          </div>
          <div class="right col-auto">
            <q-img :src="row.textureUrl" />
          </div>
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
  .winners-header{
    position: relative;
    height: 210px;
    margin: 5px auto;
    @media (max-width: $breakpoint-xs-max){ height: 110px;}
    background-color: #384CAD;
    .title{
      font-size: 3rem;
      font-weight: bolder;
      position: absolute;
      top: calc(35% - 10px);
      left: calc(5%);
      color: white;
      margin: auto;
      @media (max-width: $breakpoint-xs-max){ font-size: 1.3rem;top: calc(15%)}
    }
  }
#winners{
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  align-items: center;
  height: 63vh;
  overflow-y: scroll;
  @media (min-width: $breakpoint-md-min){ .prize, .date, .user{font-size: 1.2rem}}
  @media (max-width: $breakpoint-xl-max){ width: 1170px;}
  @media (max-width: $breakpoint-lg-max){ width: 920px;}
  @media (max-width: $breakpoint-md-max){ width: 90%;}
  @media (max-width: $breakpoint-sm-max){ width: 100%;}
  @media (max-width: $breakpoint-xs-max){ width: 100%;height: 79vh}
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  margin: auto;
  .winner{
    width: 100%;
    padding: 28px 18px;
    border-radius: 5px;
    margin-bottom: 20px;
    align-items: center;
    .left{
      padding-right: 50px;
      @media (max-width: $breakpoint-xs-max){padding-right: 10px}
      .prize{
        font-weight: 500;
      }
      .user{ margin: 10px 0 }
      .date{margin: 10px 0; color: grey}
    }
    .right{
      justify-self: end;
      .q-img{
        width: 150px;
        @media (max-width: $breakpoint-xs-max){max-width: 100px;}
      }
    }
  }
  .separator{
    border-left: 1px solid lightgray;
    height: 100%;
    margin-right: 45px;
    @media (max-width: $breakpoint-xs-max){margin-right: 10px};
  }
}
</style>
