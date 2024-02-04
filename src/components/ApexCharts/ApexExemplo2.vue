<template>
  <div id="app">
    <hr />
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts/dist/apexcharts.js'

export default {
  name: 'App',
  mounted () {
    // code from Example: https://apexcharts.com/javascript-chart-demos/area-charts/spline/
   var options = {
          series: [44, 55, 41, 17, 15],
          chart: {
          type: 'donut'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        }
        var chart = new ApexCharts(document.querySelector('#chart'), options)
        chart.render()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.chart {
  width: 100%;
}
</style>
