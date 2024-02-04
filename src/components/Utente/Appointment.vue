<template>
  <q-page class="absolute full-width full-height column">
  <pageHeader :showPreviousButton="true" @previousScreen="$emit('previousScreen')" > Marcação de consulta</pageHeader>
    <p>Selecione a Data e Hora Preferida</p>
    <div class="row q-pa-md">
         <q-date
            class="col"
            landscape
            v-model="appointment.appointmentDate"
            :options="optionsFn"
            mask="DD-MM-YYYY"
            />
    </div>
    <div class="row q-pa-md">
        <q-time
            v-model="appointment.time"
            :hour-options="hourOptionsTime1"
            :minute-options="minuteOptionsTime1"
            landscape
      />
    </div>
    <div class="absolute-bottom q-px-sm q-mb-lg">
            <div class="text-center q-mb-md">
                <buttone  label="Confirmar" @click="confirm" />
            </div>
        </div>
  </q-page>
</template>
<script setup>
import { date } from 'quasar'
import appointmentService from '../../services/api/appointment/appointmentService'
import utenteService from '../../services/api/utente/UtenteService'
import { ref , inject } from 'vue'

const utente = inject('utente')
const appointmentToUpdate = inject('appointmentToUpdate')

const hourOptionsTime1 = ref([8, 9, 10, 11, 12, 13, 14])
const minuteOptionsTime1 = ref([0])
const appointment = ref({
                    appointmentDate: '',
                    time: '',
                    utente: null,
                    clinic: null,
                    status: ''
                })

const optionsFn = (newDate) => {
     return newDate >= date.formatDate(Date.now(), 'YYYY/MM/DD')
}

const checkIfIsUpdate = () => {
      if (appointmentToUpdate != null && appointmentToUpdate.id > 0) {
                appointment = appointmentToUpdate
               appointment.appointmentDate = formatDate(this.appointment.appointmentDate)
                appointment.utente = utenteService.getLocalUtenteById(appointment.utente_id)
            }
}

const formatDate = (value) => {
  return date.formatDate(value, 'YYYY/MM/DD')
}

const confirm = () => {
 if (appointment.value.id <= 0) {
                appointment.value.utente = utente
                appointment.value.status = 'PENDENTE'
                appointment.value.clinic = utente.clinic
            }
            appointment.value.appointmentDate = new Date(appointment.value.appointmentDate)
            appointmentService.post(appointment.value).then(resp => {
                 emit('goHome', appointment.utente)
            }).catch(error => {
                console.log(error)
            })
            /*
            Appointment.api().post('/appointment', appointment).then(resp => {
               emit('goHome', appointment.utente)
            }).catch(error => {
                console.log(error)
            })
            */
}

</script>

