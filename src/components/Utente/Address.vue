<template>
  <q-page class="absolute full-width full-height column">
    <pageHeader :showPreviousButton="true" @previousScreen="$emit('previousScreen')"> Registo do Beneficiário</pageHeader>
    <form @submit.prevent="saveUtente">
    </form>
  </q-page>
</template>
<script>
import Province from '../../store/models/province/Province'
import Utente from '../../store/models/utente/Utente'
export default {
    props: ['utente'],
    data () {
        return {
            currUtente: {},
            selectedProvince: '',
            address: {
                city: '',
                residence: ' ',
                latitude: '',
                longitude: '',
                district: null
            }
        }
    },
    computed: {
        provinces () {
            return Province.query().with('districts').get()
        },
        districts () {
            return this.selectedProvince.districts
        }
    },
    methods: {
        getAllProvinces (offset) {
            if (this.provinces.length <= 0) {
                    Province.api().get('/province?offset=' + offset + '&max=100').then(resp => {
                        offset = offset + 100
                        if (resp.response.data.length > 0) { setTimeout(this.getAllProvinces(offset), 2) }
                    }).catch(error => {
                        console.log(error)
                    })
            }
        },
        saveUtente () {
            this.$refs.district.$refs.ref.validate()
            this.$refs.morada.validate()
            this.address.city = this.address.district.description
            this.currUtente.addresses.push(this.address)
            this.currUtente.birthDate = new Date(this.currUtente.birthDate)

            if (this.currUtente.haspartner === 'true') {
                this.currUtente.haspartner = true
            } else {
                this.currUtente.haspartner = false
            }
            console.log(this.currUtente)
            Utente.api().post('/utente', this.currUtente).then(resp => {
                this.$emit('saveUtente', resp.response.data)
                console.log(resp.response.data)
            }).catch(error => {
                console.log(error)
            })
        }
    },
    mounted () {
        const offset = 0
        this.getAllProvinces(offset)
    },
    components: {
        // pageHeader: require('components/Utente/UtenteRegistrationHeader.vue').default,
        // buttone: require('components/Shared/Button.vue').default
    },
    created () {
        this.currUtente = Object.assign({}, this.utente)
    }
}
</script>
