<template>
  <div class="q-pa-md row q-gutter-md justify-center q-mt-lg">
    <q-card class="my-card ">

      <q-card-section>
        <div class="text-h5">J'ai oublié le mot de passe</div>
      </q-card-section>

      <q-separator />

      <q-form class="q-gutter-md" @submit="submit">

        <q-card-section class="q-mt-xl q-mx-lg">
          <q-input
            v-model="email"
            label="Adresse e-mail *"
            :filled="false"
            autofocus
            lazy-rules
            :rules="[ val => val && val.length > 0 && val.indexOf('@') >= 0 || 'Entrer votre Email']"
            type="email"
          />
        </q-card-section>

        <q-card-actions  align="right" class="q-mt-md q-mb-md q-mr-sm">
          <div class="row justify-center">
          <q-btn @click="$router.push('/login')" label="Annuler" color="red-6" class="col"/>
          <q-btn label="Soumettre" :disabled="email.length < 8" type="submit" color="primary" class="q-ml-md col"/>
          </div>
        </q-card-actions>

          <separator />

      </q-form>

    </q-card>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import useGlobal from 'src/services/useGlobal'
import axios from '../services/axios'
import { alerta, notify } from 'src/helpers'
// import XXX from '../components/XXX'
export default {
// components: {},
  setup () {
    const { showSpinner, hideSpinner } = useGlobal()
    const state = reactive({
      email: ''
    })
    const submit = async () => {
      console.log('submit')
      showSpinner()
      try {
        await axios.post('/portal/portal_forgot_password', { email: state.email })
        hideSpinner()
        console.log('detalle')
        notify({ message: 'Le mail a été envoyé' })
      } catch (err) {
        hideSpinner()
        await alerta('Erreur', err)
      }
    }
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
