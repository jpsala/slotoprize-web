<template>
<div>
    <div v-if="data" id="raffles">
        <div v-for="row in data" :key="row.id" class="raffle shadow-4 row">
          <div class="left col-auto">
            <q-img :src="row.textureUrl" />
          </div>
          <div class="right col">
            <div class="prize">{{row.description}}</div>
            <div class="row">
              <div class="price-and-participations shadow-4 col-auto">
                <div class="price">{{row.raffleNumberPrice}} Tickets</div>
                <div class="participations">{{row.participationsPurchased > 0 ? row.participationsPurchased + ' participation' : 'No participations'}}</div>
              </div>
              <div class="remaining-time shadow-4 col-auto q-ml-md">
                <div class="price">Temps restant :</div>
                <div class="participations">{{row.participationsPurchased > 0 ? row.participationsPurchased + ' Participation' : 'No participations'}}</div>
              </div>
            </div>
<!-- closingDate: (...)
description: (...)
id: (...)
itemHighlight: (...)
name: (...)
participationsPurchased: (...)
raffleNumberPrice: (...)
textureUrl: (...) -->
            <div class="date"></div>
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
      const response = await axios.get(`/portal/portal_raffles?email=${user.value.email}`)
      state.data = response.data
    })
    return { ...toRefs(state) }
  }
}

</script>

<style lang="scss">
#raffles{
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
  .raffle{
    width: 100%;
    padding: 28px 18px;
    border-radius: 5px;
    margin-bottom: 20px;
    align-items: start;
    .q-img{
      width: 220px;
      @media (max-width: $breakpoint-xs-max){max-width: 100px;}
    }
    .left{
      padding-right: 50px;
      @media (max-width: $breakpoint-xs-max){padding-right: 10px}
    }
    .right{
      justify-self: end;
      .price-and-participations{
        padding: 11px 23px;
        width: 161px;
        border-radius: 6px;
        margin-top: 13px;
      }
      .remaining-time{
        padding: 11px 23px;
        width: 161px;
        border-radius: 6px;
        margin-top: 13px;
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
