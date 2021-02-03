<template>
<div>
    <div v-if="data" id="raffles">
        <div v-for="row in data" :key="row.id" class="raffle shadow-4 bg-white row">
          <div class="left col-auto">
            <q-img :src="row.textureUrl" />
          </div>
          <div class="right col" style="height: 100%; position: relative;">
            <div class="prize">{{row.description}}</div>
            <div class="row">
              <div class="price-and-participations shadow-4 col-auto">
                <div class="price">{{row.raffleNumberPrice}} Tickets</div>
                <div class="participations">{{row.participationsPurchased > 0 ? row.participationsPurchased + ' participation' : 'No participations'}}</div>
              </div>
              <div class="remaining-time shadow-4 col-auto q-ml-md">
                <div class="price">Temps restant :</div>
                <div class="participations">{{row.fromNow}}</div>
              </div>
            </div>
            <q-btn style="position: absolute; bottom: 5px; right: 5px; width: 200px; font-size: 1.5rem"
              rounded outline @click="buyRaffle(row)" class="bg-green-6 text-white">Je Joue!</q-btn>
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
import { reactive, toRefs, onMounted, onUnmounted } from '@vue/composition-api'
import axios from '../services/axios'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import relativeTime from 'dayjs/plugin/relativeTime'
import { alerta } from 'src/helpers'
dayjs.extend(relativeTime)
dayjs.locale('fr')

const state = reactive({
  data: undefined,
  email: undefined,
  emailExpansion: false,
  password: undefined,
  password2: undefined,
  passwordExpansion: false,
  user: {}
})
let fromNowInterval
export default {
  setup () {
    const { user, loggedIn } = useSession()
    const buyRaffle = async (raffle) => {
      try {
        const resp = await axios({
          url: '/portal/raffle_purchase',
          method: 'get',
          params: {
            deviceId: user.value.deviceId,
            raffleId: raffle.id,
            amount: 1
          }
        })
        console.log('resp', resp)
        await alerta('Success', 'Tirage au sort acheté')
        raffle.participationsPurchased = Number(raffle.participationsPurchased) + 1
      } catch (err) {
        await alerta('Error', err)
      }
    }
    onMounted(async () => {
      if (!loggedIn.value) return
      const response = await axios.get(`/portal/portal_raffles?email=${user.value.email}`)
      state.data = response.data.map(row => {
        row.fromNow = dayjs(row.closingDate).fromNow()
        return row
      })
      fromNowInterval = setInterval(() => {
        state.data = state.data.map(row => {
          row.fromNow = dayjs(row.closingDate).fromNow()
          return row
        })
      }, 1000)
    })
    onUnmounted(() => clearInterval(fromNowInterval))
    return { ...toRefs(state), buyRaffle }
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
