<template>
  <div key="app-to-accept">
    <UserMessage />
    <reportBar> </reportBar>
    <br />
    <div class="row q-col-gutter-md q-px-md q-py-md" key="allCharts">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <reportPie> </reportPie>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <reportLine> </reportLine>
      </div>
    </div>
  </div>
</template>
<script setup>

import reportBar from 'components/ApexCharts/BarAppointmentsChart.vue';
import reportPie from 'components/ApexCharts/PieAppointmentsChart.vue';
import reportLine from 'components/ApexCharts/LineChart.vue';
import UserMessage from 'components/Clinic/UserMessage.vue';
</script>
