<template>
<transition-group
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut absolute-top"
        >
   <q-card key="consulta" class="my-card full-width q-pa-sm">
        <div class="row text-h6">Consulta marcada</div>
        <div class="row q-mt-lg">
            <div class="col-8 q-pa-sm">
                <div class="row text-subtitle1 text-weight-bold">Detalhes da Marcação</div>
                <div v-if="appointementConfirmed" class="row text-grey-7">Marcação aceite pela US</div>
                <div v-else  class="row text-grey-7">Confirmação pendente na US</div>

                <div class="col-8 q-pa-sm">
                    <div class="row items-center q-mb-md">
                        <q-icon name="person_outline" size="sm" color="primary" />
                        <div class="q-px-sm text-grey-7">Ordem:</div>
                        <div class="text-grey-7">{{appointment.orderNumber}}</div>

                        <q-space />
                        <q-icon name="date_range" size="sm" color="primary" />
                            <div class="q-px-sm text-grey-7">{{formatDate(appointment.appointmentDate)}}</div>
                    </div>
                    <div class="row items-center ">
                        <q-icon name="schedule" size="sm" color="primary" />
                        <div class="q-px-sm text-grey-7">{{appointment.time}}</div>

                        <q-space />
                        <q-icon name="fmd_good" size="sm" color="primary" />
                            <div class="q-px-sm text-grey-7">{{appointment.clinic.name}}</div>
                    </div>
                </div>
            </div>
            <div class="col-4 q-pa-sm">
                <q-btn v-if="appointementConfirmed" flat round color="primary" class="no-pointer-events float-right" disabled size="40px" icon="check" />
                <q-btn v-else rounded color="primary" class="float-right" size="md" label="Re-marcar" @click="remarcar" />

            </div>
        </div>
    </q-card>
    </transition-group>
</template>
<script setup>
import { date } from 'quasar'
import { ref,computed , inject } from 'vue'

const confirmed = ref(false);
const appointment = inject('appointment');

const appointementConfirmed =  computed(() => {
  return appointment.value.status === 'ACEITE'
});


const formatDate = (value) => {
date.formatDate(value, 'DD-MM-YYYY')
}

const remarcar = (value) => {
  emit('rescheduleAppointment', appointment.value)
}
</script>


<style>

</style>
