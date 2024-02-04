<template>
  <div class="row items-center q-mb-md bg-deep-orange-3">
        <div class="col">
            <q-btn
                flat
                round
                color="white"
                icon="chevron_left"
               @click="closeRegistration(false)"/>
        </div>
        <div class="col-8 text-center q-mt-md"><p class="col text-white"><slot></slot></p></div>
        <div class="col"><q-space /></div>
    </div>
</template>

<script setup>
import pageHeader from 'components/Utente/UtenteRegistrationHeader.vue'
import buttone from 'components/Shared/Button.vue'
import { ref , inject } from 'vue'

const showUtenteRegistrationScreenProp = inject('showUtenteRegistrationScreenProp')
const showPreviousButton = inject('showPreviousButton')

 // emits: ['update:showUtenteRegistrationScreenProp'],
const closeRegistration = () => {
        emit('update:showUtenteRegistrationScreenProp', close)
}
</script>
<style>

</style>
