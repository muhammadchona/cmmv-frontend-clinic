<template>
  <div>
    <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
      Hoje, {{ formatDateDDMMMYYYY(new Date()) }}
    </div>
    <div class="">
      <q-toolbar>
        <q-tabs v-model="tab" shrink stretch>
          <q-tab name="ConsultasDay" label="Consultas do dia" />
          <q-tab name="ConsultasOther" label="Outras Consultas" />
          <q-tab name="ConsultasDone" label="Consultas Realizadas" />
        </q-tabs>
      </q-toolbar>
      <q-separator class="q-mx-md" />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="ConsultasDay">
          <clinicAppointmentsTable
            v-model:rows="getAppointmentsToday"
            :columns="columns"
            :updateClinicAppoitment="updateClinicAppoitment"
          />
        </q-tab-panel>
        <q-tab-panel name="ConsultasOther">
          <clinicAppointmentsTable
            v-model:rows="appointmentsBDD"
            :columns="columns"
            :updateClinicAppoitment="updateClinicAppoitment"
          />
        </q-tab-panel>
        <q-tab-panel name="ConsultasDone">
          <clinicAppointmentsTable
            v-model:rows="appointmentsDone"
            :columns="columns2"
            :updateClinicAppoitment="updateClinicAppoitment"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script setup>
import { date } from 'quasar';
import { computed, ref } from 'vue';
import Appointment from '../../stores/models/appointment/Appointment';
import clinicAppointmentsTable from 'components/Clinic/ClinicAppointmentsTable.vue';
import appointmentService from 'src/services/api/appointment/appointmentService';

const columns = [
  {
    name: 'appointmentDate',
    required: true,
    label: 'Data',
    align: 'left',
    field: (row) => row.appointmentDate,
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'systemNumber',
    required: true,
    label: 'Codigo',
    align: 'left',
    field: (row) =>
      row.utente !== undefined && row.utente !== null
        ? row.utente.systemNumber
        : 'Não Definido',
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'nameUser',
    required: true,
    label: 'Nome do Utente',
    align: 'left',
    field: (row) =>
      row.utente !== null
        ? row.utente.firstNames + ' ' + row.utente.lastNames
        : ' ',
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'hasHappened',
    required: true,
    label: 'Chegou?',
    align: 'left',
    field: (row) => (row.hasHappened ? ' Sim' : 'Não'),
    format: (val) => `${val}`,
    sortable: true
  }
];
const columns2 = [
  {
    name: 'visitDate',
    required: true,
    label: 'Data da Visita',
    align: 'left',
    field: (row) => row.visitDate,
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'systemNumber',
    required: true,
    label: 'Codigo',
    align: 'left',
    field: (row) =>
      row.utente !== undefined && row.utente !== null
        ? row.utente.systemNumber
        : 'Não Definido',
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'nameUser',
    required: true,
    label: 'Nome do Utente',
    align: 'left',
    field: (row) =>
      row.utente !== null
        ? row.utente.firstNames + ' ' + row.utente.lastNames
        : ' ',
    format: (val) => `${val}`,
    sortable: true
  },
  {
    name: 'hasHappened',
    required: true,
    label: 'Chegou?',
    align: 'left',
    field: (row) => (row.hasHappened ? ' Sim' : 'Não'),
    format: (val) => `${val}`,
    sortable: true
  }
];

const tab = ref('ConsultasDay');

const getAppointmentsToday = computed(() => {
  return appointmentService.getAppointmentsToday();
});

const appointmentsBDD = computed(() => {
  return appointmentService.appointmentsBDD();
});

const appointmentsDone = computed(() => {

  return appointmentService.getConfirmedAssignmentAndHappened();

});
const updateClinicAppoitment = (appointmentToUpdate) => {
  Appointment.update({
    where: (appointment) => {
      return appointment.id === appointmentToUpdate.id;
    },
    data: appointmentToUpdate
  });
  // const appointmentLocalBase = JSON.parse(JSON.stringify(appointmentToUpdate))
  db.newDb()
    .collection('appointments')
    .doc({ id: appointmentToUpdate.id })
    .set(appointmentToUpdate);
};

const formatDateDDMMMYYYY = (value) => {
  return date.formatDate(value, 'DD MMM YYYY');
};

</script>
