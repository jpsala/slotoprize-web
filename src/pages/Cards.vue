<template>
  <div class="cards-page">
    <collection  v-if="showCollection" :collection="collection" @close="closeCollection"/>
    <change-cards v-if="data && data.tradeData" v-model="showChangeCards" :trade-data="data.tradeData" @done="doneChangeCards" @close="showChangeCards = false" />
    <div class="title">Complétez la collection des cartes et obtenez des prix fabuleaux!</div>
    <q-btn @click="changeCards" rounded color="blue-10" class="change-cards">Echangez vos cartes en double</q-btn>
    <div v-if="data && !showCollection" class="cards">
       <q-card
          @click="collection = {cards: row.cards, title: row.title} ; showCollection = true"
          v-for="row in data.collectibleCardSets" :key="row.id" class="my-card"
          :class="row.ownedQuantity > 0 ? 'quantity':''"
        >
        <q-img :src="frontCardUrl(row)">
          <q-badge v-if="row.ownedQuantity > 0" color="orange" floating>{{row.ownedQuantity}}</q-badge>
          </q-img>

      <q-card-section>
        <div class="text-h6 card-title">{{row.title}}</div>
        <div class="text-h6 card-subtitle row card-det">
          <div class='reward-amount col'>
            <span class="reward-amount">&nbsp;{{Math.ceil(row.rewardAmount/1000)}}K</span>
            <q-img src="../assets/coinbag.png" class="coin-bag" />
          </div>
        </div>
        <div class="col owned-cards">{{row.ownedQuantity}} of {{row.cards.length}}</div>
      </q-card-section>

    </q-card>
  </div>
  </div>
</template>
<script>
import useSession from '../services/useSession'
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import axios from '../services/axios'
import useGlobal from '../services/useGlobal'
import Collection from '../components/Collection'
import ChangeCards from 'src/components/ChangeCards.vue'

const state = reactive({
  data: undefined,
  email: undefined,
  emailExpansion: false,
  password: undefined,
  password2: undefined,
  passwordExpansion: false,
  user: {},
  collection: undefined,
  showCollection: false,
  showChangeCards: false
})
export default {
  components: { Collection, ChangeCards },
  setup () {
    const { showSpinner, hideSpinner } = useGlobal()
    const { user, loggedIn } = useSession()
    const closeCollection = () => {
      state.collection = { cards: [], title: '' }
      state.showCollection = false
    }

    const changeCards = () => {
      state.showChangeCards = true
    }

    const frontCardUrl = (cardSet) => {
      const card = cardSet.cards.find(_card => _card.id === cardSet.frontCardId)
      return card.thumbUrl
    }
    const doneChangeCards = async () => {
      await getCards()
      state.showChangeCards = false
    }

    const getCards = async () => {
      showSpinner()
      const response = await axios.get('/portal/card_collections', {
        params: { email: user.value.email }
      })
      hideSpinner()
      console.log('response', response)
      state.data = response.data
    }

    onMounted(async () => {
      if (!loggedIn.value) return
      await getCards()
      console.log('detalle', loggedIn, JSON.stringify(user.value, null, 2))
    })
    return { ...toRefs(state), frontCardUrl, closeCollection, changeCards, doneChangeCards }
  }
}

</script>
<style lang="scss">
.cards-page{
  display: flex;
  flex-direction: column;
  .title{
    margin: 5px 0px;
    text-align: center;
    font-size: 1.1rem;
    @media(max-width: $breakpoint-sm-max){
      margin: 4px 4px;
    }
  }
  .change-cards{
    color: white;
    font-size: 1.1rem;
    margin: 10px 20px;
    @media(max-width: $breakpoint-sm-max){
      margin: 4px 4px;
    }
  }
  .cards{
    display: flex;
    flex-wrap: wrap;
    place-content: space-evenly;
    .q-card{
      cursor: pointer;
      margin-top: 20px;
      width: 250px;
      .card-title, .card-subtitle{
        text-align: center;
      }
      &.quantity{
        border: 1px solid red;
      }
    }
    img{
      width: 220px;
    }
    .owned-cards{text-align: center; font-size: 1rem;}
    .card-det{
      align-items: center!important;
      justify-content: center;
      .reward-amount{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .reward-amount{
          z-index: 1;
          font-size: 1rem;
          font-weight: 400;
        }
        .coin-bag{
          margin-left: 10px;
          width: 25px;
        }
      }
    }
  }
}
</style>
