<template>
  <div class="q-pa-md q-gutter-md justify-center collection-component">
    <q-btn fab icon="close" class="close-btn" color="red-8" @click="$emit('close')"/>
    <h3 class="q-ml-xl q-pl-xl">{{collection.title}}</h3>
    <div class="row">
      <div v-if="collection.cards.length > 0" class="cards-in-component">
        <q-card v-for="row in collection.cards" :key="row.id" class="my-card" :class="row.ownedQuantity > 0 ? 'quantity':''">
          <q-img :src="row.thumbUrl">
            <q-badge v-if="row.ownedQuantity > 0" color="yellow-8" floating>
              {{row.ownedQuantity * row.stars}}&nbsp;<q-icon class="star" size="sm" name="star_rate" color="yellow-3"/>
            </q-badge>
          </q-img>

          <q-card-section>
            <div class="text-h6 card-title">{{row.title}}</div>
            <q-rating
              v-model="row.stars"
              size="2em"
              color="orange"
              readonly
            />
          </q-card-section>

        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api'

export default {
  props: {
    collection: { type: Object, default: () => { return { cards: [], title: '' } } }
  },
  setup (props) {
    const state = reactive({
      xxx: undefined
    })
    return { ...toRefs(state) }
  }
}
</script>
<style lang="scss">
.collection-component{
  position: relative;
  .close-btn{
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .cards-in-component{
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start;
    .q-card{
      cursor: pointer;
      margin-top: 20px;
      margin-right: 10px;
      width: 250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      @media(max-width: $breakpoint-sm-max){width: 100%}
      .card-title, .q-rating{
        display: block;
        text-align: center;
      }
      &.quantity{
        border: 1px solid red;
      }
    }
    img{
      width: 220px;
    }
  }
}
</style>
