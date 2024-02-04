<template>
  <VueApexCharts
    style="max-width: 100%"
    height="500"
    type="bar"
    :options="chartOptions"
    :series="series"
  ></VueApexCharts>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import moment from 'moment';
import { ref, computed,  onMounted } from 'vue';
import appointmentService from 'src/services/api/appointment/appointmentService';

const monthsX = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEC',
];
const toDateStr = (str) =>
  new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'));
const monthsEng = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

const mapAppointmentsPending = ref(new Map());
const mapAppointmentsConfirmed = ref(new Map());
const mapAppointmentsDone = ref(new Map());

const chartOptions = {
  // ApexCharts options
  chart: {
    id: 'vue-chart-bar',
  },
  colors: ['#F44336', '#13c185', '#13a6c1'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 1000,
  },
  title: {
    text: 'Consultas',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
    },
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,
  },
  fill: {
    opacity: 2,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [...monthsX],
  },
};

const getAppointmentsPendingByMonth = () => {
  var monthsPresent = [];
  const map = appointmentsPending.value.reduce((a, b) => {
    const m = toDateStr(b.appointmentDate).getMonth();
    a[m] = (a[m] || 0) + 1;
    monthsPresent.push(monthsEng[+m]);
    return a;
  }, {});
  let result = Object.entries(map).map(([key, data]) => ({
    data,
    key: monthsEng[+key],
  }));
  var monthsNot = monthsEng.filter((item) => !monthsPresent.includes(item));
  for (const item of monthsNot) {
    result.push({ data: 0, key: item });
  }
  result = result.sort(function (a, b) {
    // sort based on the value in the monthNames object
    return +moment(a.key, 'MMM') - moment(b.key, 'MMM');
  });
  return result;
};

const getAppointmentsDoneByMonth = () => {
  var monthsPresent = [];
  const map = appointmentsDone.value.reduce((a, b) => {
    const m = toDateStr(b.appointmentDate).getMonth();
    console.log(m);
    a[m] = (a[m] || 0) + 1;
    monthsPresent.push(monthsEng[+m]);
    return a;
  }, {});
  let result = Object.entries(map).map(([key, data]) => ({
    data,
    key: monthsEng[+key],
  }));
  var monthsNot = monthsEng.filter((item) => !monthsPresent.includes(item));
  for (const item of monthsNot) {
    result.push({ data: 0, key: item });
  }
  result = result.sort(function (a, b) {
    // sort based on the value in the monthNames object
    return +moment(a.key, 'MMM') - moment(b.key, 'MMM');
  });
  return result;
};

const getAppointmentsConfirmedByMonth = () => {
  var monthsPresent = [];
  const map = appointmentsConfirmed.value.reduce((a, b) => {
    const m = toDateStr(b.appointmentDate).getMonth();
    console.log(m);
    a[m] = (a[m] || 0) + 1;
    monthsPresent.push(monthsEng[+m]);
    return a;
  }, {});
  let resu = Object.entries(map).map(([key, data]) => ({
    data,
    key: monthsEng[+key],
  }));
  var monthsNot = monthsEng.filter((item) => !monthsPresent.includes(item));
  for (const item of monthsNot) {
    resu.push({ data: 0, key: item });
  }
  resu = resu.sort(function (a, b) {
    // sort based on the value in the monthNames object
    return +moment(a.key, 'MMM') - moment(b.key, 'MMM');
  });
  return resu;
};

const appointmentsPending = computed(() => {
  return appointmentService.appointmentsPendingReports();
});

const appointmentsDone = computed(() => {
  return appointmentService.appointmentsDoneReports()
});

const appointmentsConfirmed = computed(() => {
  return appointmentService.appointmentsConfirmedReports()
});
const series = computed(() => {
  var mapIter = mapAppointmentsPending.value.values();
  var arrPending = [];
  for (const item of mapIter) {
    arrPending.push(item.data);
  }
  var mapIter1 = mapAppointmentsDone.value.values();
  var arrDone = [];
  for (const item of mapIter1) {
    arrDone.push(item.data);
  }
  var mapIter2 = mapAppointmentsConfirmed.value.values();
  var arrConfirmed = [];
  for (const item of mapIter2) {
    arrConfirmed.push(item.data);
  }
  return [
    {
      name: 'Consultas Pendentes',
      data: [...arrPending],
    },
    {
      name: 'Consultas Realizadas',
      data: [...arrDone],
    },
    {
      name: 'Consultas Confirmadas',
      data: [...arrConfirmed],
    },
  ];
});

onMounted(() => {
  mapAppointmentsPending.value = getAppointmentsPendingByMonth();
  mapAppointmentsDone.value = getAppointmentsDoneByMonth();
  mapAppointmentsConfirmed.value = getAppointmentsConfirmedByMonth();
});
</script>
