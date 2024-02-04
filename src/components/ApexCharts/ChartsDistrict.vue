<template>
  <div key="app-to-accept">
    <UserMessage />
    <reportBarDistrict> </reportBarDistrict>
    <br />
    <div style="max-width: 100%">
      <reportBarLinkDistrict> </reportBarLinkDistrict>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

import UserMessage from 'components/Clinic/UserMessage.vue';
import reportBarDistrict from 'components/ApexCharts/BarChartAppointmentsDistrict.vue';
import reportBarLinkDistrict from 'components/ApexCharts/BarChartAppointmentsLinkDistrict.vue';

const isUserClinic = ref(true);

onMounted(() => {
  if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    isUserClinic.value = false;
  }
});
</script>
