<template>
    <q-page>
        <div class="q-pa-lg">
            <div class="row text-h6 text-green">Gestão de Mobilizadores</div>
            <div class="row q-mt-lg">
                <q-input outlined label="Pesquisar" class="col" v-model="searchField"  @keyup.esc="searchField = ''">
                    <template v-slot:append>
                        <q-icon v-if="searchField === ''" name="search" />
                        <q-icon v-else name="clear" class="cursor-pointer" @click="searchField = ''" />
                    </template>
                </q-input>
            </div>
            <div class="row q-mt-lg">
                <q-table
                    class="col"
                    :rows="mobilizers"
                    :columns="columns"
                    row-key="name"
                    v-model:selected="selected"
                    >
                </q-table>
            </div>
            <div class="absolute-bottom text-center q-mb-xl no-pointer-events">
                <q-btn
                    size="35px"
                    round
                    color="primary"
                    icon="add"
                    @click="showAddMobilizer = true"
                    class="all-pointer-events"
                    />
            </div>
        </div>
        <q-dialog v-model="showAddMobilizer">
          <AddMobilizer :clinic="currClinic" @close="showAddMobilizer = false" />
        </q-dialog>
    </q-page>
</template>

<script>
import { ref } from 'vue'
import CommunityMobilizer from 'stores/models/mobilizer/CommunityMobilizer';
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
    align: 'left',
    field: row => row.fullName,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'contacts',
    field: row => row.contacts,
    format: val => `${val}`,
    align: 'center',
    label: 'Contactos',
    sortable: false
    }
]

export default {
    props: ['clinic'],
    data () {
        return {
            searchField: '',
            selected: ref([]),
            columns,
            showAddMobilizer: false,
            currClinic: {}
        }
    },
    components: {
        AddMobilizer: require('components/Clinic/AddMobilizer.vue').default
    },
    mounted () {
        this.getAllClinicMobilizers()
    },
    created () {
        this.currClinic = Object.assign({}, this.clinic)
    },
    methods: {
        getAllClinicMobilizers () {
            CommunityMobilizer.api().get('communityMobilizer/clinic/' + this.currClinic.id).then(resp => {
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        }
    },
    computed: {
        mobilizers () {
            return CommunityMobilizer.query().where('clinic_id', this.currClinic.id).get()
        }
    }
}
</script>

<style>

</style>
