<template>
    <apexchart
  width="500"
  height="400"
  type="bar"
  :options="chartOptions"
  :series="series"
></apexchart>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import District from '../../store/models/district/District'
import CommunityMobilizer from '../../store/models/mobilizer/CommunityMobilizer'
import Province from '../../store/models/province/Province'
const series = []
const categories = []

export default {
     components: {
    apexchart: VueApexCharts
  },
  data: function () {
    return {
      chartOptions: { // ApexCharts options
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
              categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
            }
      },
    series: [{
    data: [{
      x: 'category A',
      y: 10
    }, {
      x: 'category B',
      y: 18
    }, {
      x: 'category C',
      y: 13
    }]
  }]
    }
  },
  methods: {
      getAllMobilizers () {
          CommunityMobilizer.apiGetAll()
      },
       getSeriesAndCategories () {
        for (let x = 0; x < this.mobilizers.length; x++) {
         series.push({
           name: this.mobilizers[x].id,
            data: this.mobilizers[x].id
            })
        categories.push(this.mobilizers[x].firstNames)
}
      },
      groupMobilizersByProvince  () {
        for (let x = 0; x < this.mobilizers.length; x++) {
          const districts = new Set()
          districts.add(this.mobilizers[x].district_id)
        }
      }
  },
  computed: {
        mobilizers () {
            return CommunityMobilizer.all()
     },
        provinces () {
            return Province.all()
     },
      districts () {
            return District.all()
     }
    },
    created () {
      this.getAllMobilizers()
      //  this.getSeriesAndCategories()
       // console.log(JSON.stringify(series))
        console.log(this.provinces)
         console.log(this.districts)
        this.groupMobilizersByProvince()
    }
}

</script>
