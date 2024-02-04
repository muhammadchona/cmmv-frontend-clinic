<template>
  <div
    style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
  >
    <VueApexCharts
      style="max-width: 50%"
      type="donut"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import {ref, computed} from 'vue'
import appointmentService from 'src/services/api/appointment/appointmentService';

const chartOptions = {
  labels: [
    'Consultas Pendentes',
    'Consultas Realizadas',
    'Consultas Confirmadas',
  ],
  colors: ['#F44336', '#13c185', '#13a6c1'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 2000,
  },
  title: {
    text: 'Eficiencia',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Rubik',
            color: '#dfsda',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val;
            },
          },
          total: {
            show: true,
            label: 'Total',
            color: '#373d3f',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            },
          },
        },
      },
    },
  },
};

const getAppointmentsNumber = () => {
  const appointmentsNum = [];
  appointmentsNum.push(appointmentsPending.value.length);
  appointmentsNum.push(appointmentsDone.value.length);
  appointmentsNum.push(appointmentsConfirmed.value.length);
  return appointmentsNum;
};

const appointmentsPending = computed(() => {
 return  appointmentService.appointmentsPendingReports()
});

const appointmentsDone = computed(() => {

  return appointmentService.appointmentsDoneReports()
});

const appointmentsConfirmed = computed(() => {
     return appointmentService.appointmentsConfirmedReports()
});
const series = computed(() => {
  //   var series = [11, 32, 45, 32]
  const series = getAppointmentsNumber();
  return series;
});
</script>
