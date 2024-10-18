<template>
  <div class="q-gutter-md q-mb-md row items-center justify-end">
    <q-btn
      label="Baixar Relatório"
      @click="downloadChart"
      color="primary"
    ></q-btn>
  </div>
  <div
    style="width: 1200px; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
  >
    <VueApexCharts
      ref="chartRef"
      style="max-width: 50%"
      type="line"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import appointmentService from 'src/services/api/appointment/appointmentService';
import moment from 'moment';
import { ref, computed, onMounted } from 'vue';
import DownloadFileMobile from 'src/utils/DownloadFileMobile';
const chartRef = ref(null);
// import moment from 'moment'
const month = [
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

const Nmap1 = ref(new Map());

const chartOptions = {
  // ApexCharts options
  chart: {
    id: 'vue-chart-line',
    toolbar: {
      show: true,
      tools: {
        download: false, // Hide the download button
        selection: false, // Hide the selection tool
        zoom: true, // Show the zoom tool
        zoomin: true, // Show the zoom in tool
        zoomout: true, // Show the zoom out tool
        pan: true, // Show the pan tool
        reset: true, // Show the reset tool
      },
    },
  },
  colors: ['#13c185'],
  title: {
    text: 'Tendencias de Chegada',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 1000,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 7,
    dashArray: 0,
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
    categories: [...month],
  },
};

const getAppointmentsDoneByMonth = () => {
  var monthsPresent = [];
  const toDate = (str) =>
    new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'));
  const month = [
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
  const map = appointmentsDone.value.reduce((a, b) => {
    const m = toDate(b.appointmentDate).getMonth();
    console.log(m);
    a[m] = (a[m] || 0) + 1;
    monthsPresent.push(month[+m]);
    return a;
  }, {});
  let result = Object.entries(map).map(([key, data]) => ({
    data,
    key: month[+key],
  }));
  var monthsNot = month.filter((item) => !monthsPresent.includes(item));
  for (const item of monthsNot) {
    result.push({ data: 0, key: item });
  }
  result = result.sort(function (a, b) {
    // sort based on the value in the monthNames object
    console.log(+moment(a.key, 'MMM') - moment(b.key, 'MMM'));
    return +moment(a.key, 'MMM') - moment(b.key, 'MMM');
  });
  return result;
};

const appointmentsDone = computed(() => {
  return appointmentService.appointmentsDoneReports();
});

const series = computed(() => {
  var mapIter = Nmap1.value.values();
  var arrDone = [];
  for (const item of mapIter) {
    arrDone.push(item.data);
  }
  return [
    {
      name: 'Consultas Realizadas',
      data: [...arrDone],
    },
  ];
});
onMounted(() => {
  Nmap1.value = getAppointmentsDoneByMonth();
});

const downloadChart = () => {
  if (chartRef.value) {
    // Access chart instance and trigger download
    chartRef.value.dataURI().then(({ imgURI }) => {
      const blob = dataURItoBlob(imgURI);
      const titleFile =
        'LineChart' + moment(new Date()).format('DD-MM-YYYY_HHmmss');
      DownloadFileMobile.downloadFile(titleFile, '.jpg', blob);
    });
  }
};

// Helper function to convert Data URL to Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
</script>
