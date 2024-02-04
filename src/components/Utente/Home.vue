<template>
  <q-page class=" absolute full-width full-height column" >
    <div class="q-pa-md">
        <div class="row q-mb-xl">
            <div class="col-4">
                <img class="rounded-borders"
                    src="~src/assets/splash_img.png"
                    style="width: 100%; height: 150px"
                    >
            </div>

            <div class="col-8 q-pl-lg q-mt-lg">
                <div class="text-subtitle1 q-pb-sm text-grey-9">{{utente.firstNames + ' ' + utente.lastNames}}</div>
                <div class="row items-center">
                    <q-icon name="call" size="sm" color="grey-5" />
                    <div class=" text-subtitle2 q-px-xs text-grey-7" >Nr Telemóvel:</div>
                    <div class=" text-subtitle2 " >{{utente.cellNumber}}</div>
                </div>
                <div class="row items-center">
                    <q-icon name="textsms" size="sm" color="grey-5" />
                    <div class=" text-subtitle2 q-px-xs text-grey-7" >Nr WhatsApp:</div>
                    <div class=" text-subtitle2" >{{utente.whatsappNumber}}</div>
                </div>
                <div class="row items-center q-mt-sm">
                        <q-icon name="fmd_good" size="sm" color="grey-5" />
                        <div class="q-px-sm text-grey-7">{{utente.addresses[0].city}}</div>
                </div>
            </div>
        </div>

        <div class=" q-my-md row text-h6 text-primary text-weight-bold">Detalhes do Beneficiário</div>
        <div class="row">
            <div class="col q-ma-xs">
                <q-card class="my-card text-center " :class="{'bg-orange-1' : usTab}">
                    <q-card-section>
                        <q-btn flat round color="primary" size="24px" icon="add" @click="changeTab('us')" />
                        <div class=" text-primary text-caption">Unidade Sanitária</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-ma-xs">
                <q-card class="my-card text-center" :class="{'bg-orange-1' : mobilizerTab}">
                    <q-card-section>
                        <q-btn flat round color="primary" size="24px" icon="add"  @click="changeTab('mobilizador')"/>
                        <div class=" text-primary text-caption">Visualizar Mobilizador</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-ma-xs">
                <q-card class="my-card text-center" :class="{'bg-orange-1' : consultaTab}">
                    <q-card-section>
                        <q-btn flat round color="primary" size="24px" icon="add"  @click="changeTab('consulta')"/>
                        <div class=" text-primary text-caption">Marcar Consulta</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-ma-xs">
                <q-card class="my-card text-center" :class="{'bg-orange-1' : materialTab}">
                    <q-card-section>
                        <q-btn flat round color="primary" size="24px" icon="add"  @click="changeTab('informativeMaterial')"/>
                        <div class=" text-primary text-caption">Material Educativo</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <div class="row q-mt-lg rounded-borders bordered">
            <noMobilizer
                v-if="mobilizerTab && utente.communityMobilizer === null"/>
            <mobilizer
                :mobilizer="utente.communityMobilizer"
                v-if="mobilizerTab && utente.communityMobilizer != null"/>
            <consulta
                :appointment="appointment"
                @rescheduleAppointment="rescheduleAppointment"
                v-if="consultaTab" />
            <us
                :clinic="utente.clinic"
                v-if="usTab && utente.clinic != null"/>
            <noMobilizer v-if="usTab && utente.clinic === null" />
            <informative-docs
                v-if="materialTab"
                :docsOrImages="docsOrImages" />
        </div>
    </div>

    <div class="row">
        <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-grey-7 full-width absolute-bottom q-mb-xs"
      >
        <q-tab :ripple="false" name="home" icon="home" label="Inicio" />
        <q-tab :ripple="false" name="message" icon="message" label="Mensagens" />
        <q-tab :ripple="false" name="settings" icon="settings" label="Definições" />
      </q-tabs>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
export default {
    props: ['utente'],
     data () {
        return {
            tab: ref('home'),
            noMobilizerTab: false,
            mobilizerTab: false,
            usTab: true,
            consultaTab: false,
            materialTab: false,
            currUtente: {}
        }
  },
  methods: {
        changeTab (selectedTab) {
        this.mobilizerTab = false
        this.usTab = false
        this.consultaTab = false
        this.materialTab = false

        if (selectedTab === 'us') {
            if (this.currUtente.clinic === null) {
                this.$emit('searchClinic', this.currUtente)
            } else {
                this.usTab = true
            }
        } else if (selectedTab === 'mobilizador') {
            this.mobilizerTab = true
        } else if (selectedTab === 'consulta') {
            if (this.currUtente.appointments.length <= 0) {
                this.$emit('makeAppointment', this.currUtente)
            } else {
                this.consultaTab = true
            }
        } else if (selectedTab === 'informativeMaterial') {
            this.materialTab = true
        }
      },
      rescheduleAppointment (appointment) {
          this.$emit('rescheduleAppointment', appointment)
      }
  },
  computed: {
      appointment () {
          if (this.currUtente.appointments != null && this.currUtente.appointments.length > 0) {
              return this.currUtente.appointments[this.currUtente.appointments.length - 1]
          } else {
              return null
          }
      }
  },
  mounted () {},
  components: {
      noMobilizer: require('components/Home/NoMobilizer.vue').default,
      mobilizer: require('components/Home/Mobilizer.vue').default,
      consulta: require('components/Home/Consulta.vue').default,
      us: require('components/Home/SanitaryUnit.vue').default,
      'informative-docs': require('components/Home/MaterialEducativo.vue').default
  },
    created () {
        this.currUtente = Object.assign({}, this.utente)
    }
}
</script>

<style>

</style>
