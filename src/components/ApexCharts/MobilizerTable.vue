<template>
    <div>
     <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
      Desempenho
        </div>
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import CommunityMobilizer from '../../store/models/mobilizer/CommunityMobilizer'

const columns = [
  { name: 'name', required: true, label: 'Mobilizador', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true },
  { name: 'packSize', required: true, label: 'Associados', align: 'left', field: row => row.packSize, format: val => `${val}`, sortable: true },
   { name: 'defaultTimes', required: true, label: 'Ligados', align: 'left', field: row => row.defaultTimes, format: val => `${val}`, sortable: true }
]
export default {
  data () {
    const $q = useQuasar()

    return {
        columns,
        $q,
         filter: ref('')
    }
  },
 computed: {
   mobilizers () {
            return CommunityMobilizer.all()
        }
  },
  methods: {
      getMobilizersReport () {
          var utentesAssociadoNum = 0
           var utentesEnviadoNum = 0
          // var mobilizerMap =  new Map();
           for (const mobilizer of this.mobilizers) {
            var utentes = mobilizer.utentes
           for (const utente of utentes) {
             if (utente.status === 'ASSOCIADO') {
               utentesAssociadoNum++
             } else if (utente.status === 'ENVIADO') {
               utentesEnviadoNum++
             }
             console.log('11' + utentesAssociadoNum)
              console.log(utentesEnviadoNum)
         }
      }
      }
  },
  mounted () {
   // this.getDrugs()
  this.getMobilizersReport()
  },
  components: {
  //   nationalClinicsTable: require('components/Settings/NationalClinic/NationalClinicsTable.vue').default
  }
}
</script>
