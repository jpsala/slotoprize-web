<template>
<q-dialog :value="value" persistent transition-show="scale" transition-hide="scale">
  <q-card class="change-cards q-pb-md">
    <q-btn class="btn-close" flat size="lg" icon="clear" @click="$emit('close')"/>
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">Échanger vos cartes</div>
      <div class="text-subtitle2">Echangez vos cartes en double pour des récompenses incroyables!</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="star-count flex">
        <div class="span-uno">Vous avez: </div>
        <q-icon class="star" size="lg" name="star_rate" color="yellow-8"/>
        <div class="stars">{{tradeData.starsForTrade}}</div>
        <div class="span-uno q-mx-sm">Etoiles</div>
      </div>
      <div class="chest">
        <q-img class="chest-img" src="../assets/chest.png" />
        <div class="button shadow-3" @click="changeCards('regular')">
          <span class=" text-subtitle1 text-weight-bold">Echanger</span>
          <q-icon class="star" size="md" name="star_rate" color="yellow-8"/>
          <div class="stars text-weight-bold">{{tradeData.chestRegular.amount}}</div>
        </div>
      </div>
      <div class="chest q-mt-lg">
        <q-img class="chest-img" src="../assets/chest.png" />
        <div class="button shadow-3" @click="changeCards('premium')">
          <span class=" text-subtitle1 text-weight-bold">Echanger</span>
          <q-icon class="star" size="md" name="star_rate" color="yellow-8"/>
          <div class="stars text-weight-bold">{{tradeData.chestPremium.amount}}</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</q-dialog>
</template>

<script>
import { alerta, notify } from 'src/helpers'
import axios from '../services/axios'
import useGlobal from '../services/useGlobal'
import useSession from '../services/useSession'

const { user } = useSession()
const { showSpinner, hideSpinner } = useGlobal()

export default {
  props: {
    value: { default: () => false },
    tradeData: undefined
  },
  name: 'change-cards',
  setup (props, { emit }) {
    const changeCards = async (chest) => {
      const neededStars = chest === 'regular' ? props.tradeData.chestRegular.amount : props.tradeData.chestPremium.amount
      const stars = props.tradeData.starsForTrade
      if (neededStars > stars) {
        await alerta('OOOPS!', 'You don\'t have enough stars')
        return
      }
      showSpinner()
      const response = await axios.get('/portal/card_trade', {
        params: { regular: chest === 'regular', email: user.value.email }
      })
      console.log('response', JSON.stringify(response, null, 2))
      hideSpinner()
      emit('done')
      notify({ message: 'woking on this' })
    }
    return { changeCards }
  }
}
</script>

<style lang="scss">
.change-cards{
  position: relative;
  .btn-close{
    position: absolute;
    top: -2px;
    right: 0px;
    z-index: 1;
    color: white;
  }
  .stars{font-size: 1.2rem}
  .star-count{
    justify-content: center;
    align-items: center;
    place-content: center;
    font-size: 1rem;
    padding: 5px 5px;
    border: 1px solid rgb(45, 60, 221);
    border-radius: 15px;
    width: 90%;
    text-align: center;
    margin: auto;
    margin-bottom: 16px;
  }
  .star{
    margin: 0 8px;
    display: inline-block;
  }
  .chest{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .chest-img{
      width: 100px
    }
    .button{
      cursor: pointer;
      background-color: $blue-7;
      color: white;
      display: flex;
      align-self: center;
      justify-content: center;
      align-items: center;
      padding: 5px 10px;
      border-radius: 10px;
      margin-left: 10px;
      flex-grow: 1;
      text-align: center;
    }
  }
}
</style>
