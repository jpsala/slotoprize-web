<template>
<div id="menu" class="shadow-8">
    <div class="content">
    <div v-if="data" id="profile">

        <h6 class="title">Remplissez vos coordonnnés por recevoir vos gains!</h6>

        <div class="row q-mb-lg">
          <div class="col col-auto">
          <q-list padding bordered class="rounded-borders">
            <q-expansion-item style="width: 250px"
              v-model="emailExpansion" dense dense-toggle expand-separator icon="perm_identity" label="Changer email"
            >
              <q-card>
                <q-card-section>
                  <q-input type="email" flat outlined v-model="email" />
                  <div v-show="data.email !== email" class="row flex justify-end q-mt-md">
                    <q-btn @click="email = data.email ; emailExpansion = false" label="Cancel"/>
                    <q-btn @click="changeEmail" label="changement" color="primary"/>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          </div>
          <div class="col col-auto">
          <q-list padding bordered class="rounded-borders">
            <q-expansion-item style="width: 300px"
              v-model="passwordExpansion" dense dense-toggle expand-separator icon="perm_identity" label="Changer le mot de passe"
            >
              <q-card>
                <q-card-section>
                  <q-input type="password" outlined v-model="password" label="Mot de passe"/>
                  <q-input type="password" outlined v-model="password2" label="Répéter le mot de passe"/>
                  <div class="row flex justify-end q-mt-md">
                    <q-btn @click="password = data.password ; passwordExpansion = false" label="Cancel"/>
                    <q-btn @click="changePassword" label="changement" color="primary" :disable="!validPassword()"/>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          </div>
        </div>
        <div class="q-ml-md" style="font-size: 1rem">Civilité</div>
        <div class="row">
          <q-radio class="q-mx-sm" v-model="data.title" val="Mr." label="Mr" />
          <q-radio class="q-mx-sm" v-model="data.title" val="Mrs." label="Mme" />
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md ">
            <q-input class="q-gutter-md" v-model="data.firstName" label="Prénom" />
            <q-input class="q-gutter-md" v-model="data.lastName" label="Nom" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md">
            <q-input class="q-gutter-md" v-model="data.address" label="Adresse" />
            <q-input class="q-gutter-md" v-model="data.zipCode" label="Code postal"/>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md date-and-phone">
            <!-- <q-input class="q-gutter-md" v-model="data.zipCode" label="Postal Code" /> -->
            <date-sep class="q-pl-md" label="Date de naissance" :date="data.birthDate" @change="(value)=>{data.birthDate = value}"/>
            <q-input class="q-gutter-md" type="tel" v-model="data.phoneNumber" label="Téléphone" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md">
            <!-- <q-input class="q-gutter-md" v-model="data.country" label="Country" /> -->
            <q-input class="q-gutter-md" v-model="data.city" label="Ville" />
            <country class="q-gutter-md" :country="country" @change="countryChanged" />
          </div>
        </div>
        <div class="footer">
          <!-- <q-separator inset/> -->
          <div class="buttons">
            <q-btn @click="actualMenu = 'game'" label="Cancel" />
            <q-btn @click="submit" label="Envoyer" color="primary"/>
          </div>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import useSession from '../services/useSession'
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import axios from '../services/axios'
import useSloto from '../services/useSloto'
import { notify } from 'src/helpers'
import Country from '../components/Country'

const state = reactive({
  data: undefined,
  email: undefined,
  emailExpansion: false,
  password: undefined,
  password2: undefined,
  passwordExpansion: false,
  country: null,
  user: {}
})
const { actualMenu } = useSloto()
export default {
  components: { Country },
  setup () {
    const { user, loggedIn } = useSession()
    const submit = async () => {
      await axios.post('/portal/portal_profile', state.data)
      notify({ message: 'Profile saved' })
      actualMenu.value = 'game'
    }
    async function changeEmail () {
      await axios.post('/portal/portal_email', {
        id: state.data.id,
        email: state.email
      })
      notify({ message: 'Email modifié' })
      state.data.email = state.email
      state.emailExpansion = false
    }
    async function changePassword () {
      state.data.password = state.password
      state.passwordExpansion = false
      await axios.post('/portal/portal_password', {
        id: state.data.id,
        password: state.password
      })
      notify({ message: 'Mot de passe changé' })
      state.password2 = ''
    }
    function validPassword () {
      if (state.password !== state.password2) return false
      if (state.password.length < 8) return false
      return true
    }
    function countryChanged (val) {
      state.country = val
      state.data.country = val.name
      return true
    }
    onMounted(async () => {
      if (!loggedIn.value) return
      const response = await axios.get(`/portal/portal_profile?id=${user.value.id}`)
      state.data = response.data
      state.email = state.data.email
      state.password = state.data.password
      state.country = { code: '', name: state.data.country }
    })
    return { ...toRefs(state), actualMenu, submit, changeEmail, changePassword, validPassword, countryChanged }
  }
}

</script>
<style lang="scss">
.content{
  position: absolute;
  width: 1110px;
  max-width: 90%;
  background-color: white;
  padding: 40px;
  // min-height: 800px;
  top: 85%;
  left: 50%;
  z-index: 1;
  border-radius: 8px;
  transform: translatex(-50%);

  .date-sep{
    margin-bottom: -23px;
    @media (min-width: $breakpoint-sm-max){
      margin-bottom: -16px
    }
  }
  // .date-and-phone{
  //   margin-top: 0px;
  // }
  @media (max-width: 750px){
    width:540px;
  }
  @media (max-width: $breakpoint-sm-max){
    padding: 0;
    width:98vw;
  }
  .footer{
    margin-top: 50px;
    .buttons{
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
      .q-btn{
        margin-right: 10px;
      }
    }
  }
}
#profile{
  .title{
    @media (max-width: $breakpoint-sm-max){
      zoom: .8;
      padding: 0px 40px;
    }
  }
  // .header{
  //   position: relative;
  //   height: 210px;
  //   margin: 5px auto;
  //   background-color: #384CAD;
  //   @media (max-width: $breakpoint-xs-max){ height: 110px;}
  //   .title{
  //     font-size: 3rem;
  //     font-weight: bolder;
  //     position: absolute;
  //     top: calc(35% - 10px);
  //     left: calc(10%);
  //     color: white;
  //     margin: auto;
  //     @media (max-width: $breakpoint-xs-max){ font-size: 2rem; top: calc(15% - 10px)}
  //   }
  // }
  .footer{
    margin-top: 50px;
    .buttons{
      margin-top: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      .q-btn{
        margin-right: 10px;
      }
    }
  }
  .date-sep{
    // margin-left: 35px;
  }
}
</style>
