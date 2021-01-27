.<template>
  <div v-if="data" id="profile">

      <h6>Complete your profile to be sure to receive your earnings</h6>

      <div class="row q-mb-lg">
        <div class="col col-auto">
         <q-list padding bordered class="rounded-borders">
          <q-expansion-item style="width: 250px"
            v-model="emailExpansion" dense dense-toggle expand-separator icon="perm_identity" label="Change Email"
          >
            <q-card>
              <q-card-section>
                <q-input type="email" flat outlined v-model="email" />
                <div v-show="data.email !== email" class="row flex justify-end q-mt-md">
                  <q-btn @click="email = data.email ; emailExpansion = false" label="Cancel"/>
                  <q-btn @click="changeEmail" label="Change" color="primary"/>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
         </q-list>
        </div>
        <div class="col col-auto">
         <q-list padding bordered class="rounded-borders">
          <q-expansion-item style="width: 250px"
            v-model="passwordExpansion" dense dense-toggle expand-separator icon="perm_identity" label="Change Password"
          >
            <q-card>
              <q-card-section>
                <q-input type="password" outlined v-model="password" label="Password"/>
                <q-input type="password" outlined v-model="password2" label="Repeat password"/>
                <div class="row flex justify-end q-mt-md">
                  <q-btn @click="password = data.password ; passwordExpansion = false" label="Cancel"/>
                  <q-btn @click="changePassword" label="Change" color="primary" :disable="!validPassword()"/>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
         </q-list>
        </div>
      </div>
      <div class="row">
        <q-radio class="q-mx-sm" v-model="data.title" val="Mr." label="Mr." />
        <q-radio class="q-mx-sm" v-model="data.title" val="Mrs." label="Mrs." />
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md ">
          <q-input class="q-gutter-md" v-model="data.firstName" label="First Name" />
          <q-input class="q-gutter-md" v-model="data.lastName" label="Last Name" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md">
          <q-input class="q-gutter-md" v-model="data.address" label="Address" />
          <q-input class="q-gutter-md" v-model="data.zipCode" label="Postal Code"/>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md">
          <!-- <q-input class="q-gutter-md" v-model="data.zipCode" label="Postal Code" /> -->
          <date-sep :date="data.birthDate" @change="(value)=>{data.birthDate = value}"/>
          <q-input class="q-gutter-md" type="tel" v-model="data.phoneNumber" label="Phone Number" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-gutter-md">
          <!-- <q-input class="q-gutter-md" v-model="data.country" label="Country" /> -->
          <country :country="country" @change="countryChanged" />
          <q-input class="q-gutter-md" v-model="data.city" label="City" />
        </div>
      </div>
      <div class="footer">
        <!-- <q-separator inset/> -->
        <div class="buttons">
          <q-btn @click="actualMenu = 'game'" label="Cancel" />
          <q-btn @click="submit" label="Submit" color="primary"/>
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
      const response = await axios.post('/portal/portal_profile', state.data)
      console.log('submit resp', response)
      actualMenu.value = 'game'
    }
    async function changeEmail () {
      const response = await axios.post('/portal/portal_email', {
        id: state.data.id,
        email: state.email
      })
      notify({ message: 'Email changed' })
      console.log('resp', response)
      state.data.email = state.email
      state.emailExpansion = false
    }
    async function changePassword () {
      console.log('password', state.password)
      state.data.password = state.password
      state.passwordExpansion = false
      const response = await axios.post('/portal/portal_password', {
        id: state.data.id,
        password: state.password
      })
      notify({ message: 'Password changed' })
      console.log('resp', response)
      state.password2 = ''
    }
    function validPassword () {
      if (state.password !== state.password2) return false
      if (state.password.length < 8) return false
      return true
    }
    function countryChanged (val) {
      console.log('countryChanged', val)
      state.country = val
      state.data.country = val.name
      return true
    }
    onMounted(async () => {
      if (!loggedIn.value) return
      console.log('detalle', loggedIn, JSON.stringify(user.value, null, 2))
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
#profile{
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
</style>
