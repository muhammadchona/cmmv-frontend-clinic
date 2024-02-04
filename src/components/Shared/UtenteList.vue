
<template>
        <q-item-section> {{utente.firstNames}} {{utente.lastNames}}
        <q-item-label caption v-if="sended"> {{utente.cellphone}}
          <div>
            <q-icon name="event"/>  {{utente.appointments[0].appointmentDate}}
            <q-icon name="place"/>  {{utente.appointments[0].clinic.name}}
          </div>
        </q-item-label>
        </q-item-section>
        <q-item-section avatar >
          <q-btn flat style="color: #FF0080" color="primary" label="Ligar a US" v-if="associated" @click="showUtenteULinkScreen = true" no-caps/>
          <q-icon name="call" color="primary" v-if="pending" />
        </q-item-section>
        <q-item-section rounded avatar v-if="pending">
              <q-checkbox v-model="checked"  @click="checkUtente"/>
        </q-item-section>
</template>
<script setup>
import { ref, onMounted, computed} from 'vue'


const pending = ref();
const sended = ref();
const associated = ref();
const checked = ref(false);
const showUtenteULinkScreen = ref(false);


const showPending = () => {
    if (utente.value.status === 'PENDENTE') {
        pending.value = true
      } else if (utente.status === 'ASSOCIADO') {
         associated.value = true
      } else if (utente.status === 'ENVIADO') {
        sended.value = true
      }
}

onMounted(() => {
  showloading();
 showPending();
});

const setUtenteChecked =  computed(() => {
   if (checked.value === true) {
       return utente.selected
      }
      return null
});
</script>