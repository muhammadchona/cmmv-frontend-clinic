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
import Appointment from '../../stores/models/appointment/Appointment';
import moment from 'moment';
import Utente from '../../stores/models/utente/Utente';
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

const mapUtentesRegistred = ref(new Map());
const mapAppointmentsPending = ref(new Map());
const mapAppointmentsConfirmed = ref(new Map());
const mapAppointmentsDone = ref(new Map());

const chartOptions = {
  // ApexCharts options
  chart: {
    id: 'vue-chart-bar',
  },
  colors: ['#F44336', '#13c185', '#13a6c1', '#ffe433'],
  stackType: '100%',
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
  const map = appointmentsPending.reduce((a, b) => {
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
  const map = appointmentsDone.reduce((a, b) => {
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
  const map = appointmentsConfirmed.reduce((a, b) => {
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

const getUtentesRegistredByMonth = () => {
  var monthsPresent = [];
  const map = utentesRegistred.reduce((a, b) => {
    const m = toDateStr(b.registerDate).getMonth();
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

const utentesRegistred = computed(() => {
  return Utente.query()
    .with('communityMobilizer')
    .orderBy('firstNames')
    .has('firstNames')
    .get();
});

const appointmentsPending = computed(() => {
  return Appointment.query()
    .where((appointment) => {
      return (
        appointment.status === 'PENDENTE' && appointment.appointmentDate !== ''
      );
    })
    .orderBy('appointmentDate', 'desc')
    .get();
});

const appointmentsDone = computed(() => {
  return Appointment.query()
    .where((appointment) => {
      return (
        appointment.status === 'CONFIRMADO' &&
        appointment.visitDate !== '' &&
        appointment.visitDate !== null &&
        appointment.visitDate !== undefined &&
        appointment.hasHappened !== false
      );
    })
    .orderBy('appointmentDate', 'desc')
    .get();
});

const appointmentsConfirmed = computed(() => {
  return Appointment.query()
    .where((appointment) => {
      return (
        appointment.status === 'CONFIRMADO' &&
        appointment.hasHappened === false &&
        appointment.visitDate === null
      );
    })
    .orderBy('appointmentDate', 'desc')
    .get();
});

const series = computed(() => {
  var mapIter = mapAppointmentsPending.values();
  var arrPending = [];
  for (const item of mapIter) {
    arrPending.push(item.data);
  }
  var mapIter1 = mapAppointmentsDone.values();
  var arrDone = [];
  for (const item of mapIter1) {
    arrDone.push(item.data);
  }
  var mapIter2 = mapAppointmentsConfirmed.values();
  var arrConfirmed = [];
  for (const item of mapIter2) {
    arrConfirmed.push(item.data);
  }
  var mapIterUtRegister = mapUtentesRegistred.values();
  var arrRegistred = [];
  for (const item of mapIterUtRegister) {
    arrRegistred.push(item.data);
  }
  return [
    {
      name: 'Utentes Registrados',
      data: [...arrRegistred],
    },
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

onBeforeMount(() => {
  //   getAllUtentesByDistrictId(localStorage.getItem('idLogin'))
  //    getAllAppointmentsByDistrictId(localStorage.getItem('idLogin'))
  mapUtentesRegistred = getUtentesRegistredByMonth();
  mapAppointmentsPending = getAppointmentsPendingByMonth();
  mapAppointmentsDone = getAppointmentsDoneByMonth();
  mapAppointmentsConfirmed = getAppointmentsConfirmedByMonth();
});
</script>
