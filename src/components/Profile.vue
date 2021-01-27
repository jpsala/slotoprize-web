.<template>
  <div v-if="data" id="profile" class="shadow-8">

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
          <q-input class="q-gutter-md" v-model="data.zipCode" label="Postal Code"
            :rules="[ (val) => validateZipCode(data.zipCode) || 'Invalid Zip Code']"
           />
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

<style lang="scss">
#profile{
  /* background-color: #fff; */
    width: 100%;
    position: relative;
  .header{
    position: relative;
    height: 210px;
    margin: 5px auto;
    background-color: #384CAD;
    .title{
      font-size: 3rem;
      font-weight: bolder;
      position: absolute;
      top: calc(35% - 10px);
      left: calc(10%);
      color: white;
      margin: auto
    }
  }
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
    @media (max-width: $breakpoint-sm-max){
      width:720px;
    }
    @media (max-width: 750px){
      width:540px;
    }
    @media (max-width: $breakpoint-sm-max){
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
}
</style>
