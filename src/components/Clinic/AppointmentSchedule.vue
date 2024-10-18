<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut absolute-top"
  >
    <div key="app-to-accept">
      <UserMessage />
      <div class="row q-mt-md text-bold">
        Marcação de Consultas ({{ appointmentsPending.length }})
        <div class="button-right q-mr-md">
          <q-btn
            flat
            icon-right="refresh"
            label="Actualizar Listas"
            no-caps
            @click="reloadPage"
          />
        </div>
      </div>

      <q-input filled v-model="searchText" label="Pesquisar" />

      <q-scroll-area style="height: 300px; max-width: auto">
        <q-list
          bordered
          separator
          class="rounded-borders q-mt-md"
          v-for="appointment in appointmentsPending"
          :key="appointment.id"
        >
          <PendingApp :appointment="appointment" />
        </q-list>
      </q-scroll-area>
      <div class="row q-mt-lg text-bold">
        Consultas Marcadas ({{ appointmentsConfirmed.length }})
      </div>
      <q-input filled v-model="searchTextConfirmed" label="Pesquisar" />
      <q-scroll-area style="height: 350px; max-width: auto">
        <q-list
          bordered
          separator
          class="rounded-borders q-mt-md"
          virtual-scroll
          v-for="appointment in appointmentsConfirmed"
          :key="appointment.id"
        >
          <AcceptedApp :appointment="appointment" />
        </q-list>
      </q-scroll-area>
    </div>
  </transition-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import appointmentService from 'src/services/api/appointment/appointmentService';

//components
import PendingApp from 'components/Clinic/PendingAppointment.vue';
import UserMessage from 'components/Clinic/UserMessage.vue';
import AcceptedApp from 'components/Clinic/AcceptedAppointment.vue';

const searchText = ref('');
const searchTextConfirmed = ref('');

const appointmentsPending = computed(() => {
  return appointmentService.getPendingAssignment(searchText.value);
});

const appointmentsConfirmed = computed(() => {
  return appointmentService.getConfirmedAssignment(
    searchTextConfirmed.value,
    searchText.value
  );
});

onMounted(() => {
  appointmentService.get(0);
});

const reloadPage = () => {
  window.location.reload();
};
</script>
<style>
.button-right {
  margin-left: auto;
}
</style>
