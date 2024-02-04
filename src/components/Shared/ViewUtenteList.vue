<template>
<div class="row items-start">
    <q-card style="width: 100%; max-width:100vw; border-radius: 3%">
          <q-card-section>
            <q-list v-if="utentes.length > 0" separator>
             <q-scroll-area :visible="false" style="height: 280px; width: 100%; max-width:100vw;">
             <q-slide-item v-for="utente in utentes" :key="utente.id" left-color="orange" right-color="red" bottom-color="red" @left="opt => onLeft(opt, utente)" @right="opt => onRight(opt,utente)" @bottom="opt => onBottom(opt, utente)">
                <template v-slot:right v-if="utente.status === 'ENVIADO'">
                  <q-icon name="highlight_off" color="white" />
                </template>
                <template v-slot:left v-if="utente.status === 'ASSOCIADO'">
                  <q-icon name="edit" color="white" />
                </template>
                 <template v-slot:bottom v-if="utente.status !== 'ENVIADO' && utente.syncStatus === 'P'">
                  <q-icon name="delete" color="white" />
                </template>
                <q-item>
                    <q-item-section side avatar>
                      <q-avatar color="grey-6" text-color="white" :v-slot="utente">
                        {{ utente.firstNames.charAt(0).toUpperCase() }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ utente.firstNames }} {{ utente.lastNames }}</q-item-label>
                      <q-item-label caption lines="1">{{ utente.cellNumber }}</q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="utente.status === 'ASSOCIADO'">
                     <div class="text-orange">
                      <q-btn dense flat style="color: #FF0080" color="primary" label="Ligar a US" @click="activeUSForm(true, utente)" no-caps/>
                      <q-icon name="arrow_forward_ios" />
                    </div>
                  </q-item-section>
                    <q-item-section side v-else-if="utente.status === 'ENVIADO' && utente.appointments.length > 0">
                      <q-item-label class="text-bold">
                        Consulta
                          <span class="span-pendente" v-if="utente.appointments[0].status ==='PENDENTE'"> {{utente.appointments[0].status}} </span>
                          <span class="text-green-9" v-else> {{utente.appointments[0].status}} </span>
                      </q-item-label>
                     <div class="">
                      <q-icon name="event"/> {{displayDate(utente.appointments[0].appointmentDate)}}
                     </div>
                      <div class="" v-if="clinicLocal(utente.appointments[0].clinic_id) !== null">
                      <q-icon name="place"/> {{clinicLocal(utente.appointments[0].clinic_id).name}}
                    </div>
                  </q-item-section>
                </q-item>
              </q-slide-item>
             </q-scroll-area>
            </q-list>
            <q-list v-else separator>
                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon color="red" name="mood_bad" />
                  </q-item-section>
                <q-item-section class="text-left">Sem resultados na lista</q-item-section>
              </q-item>
          </q-list>
          </q-card-section>
          <q-dialog persistent v-model="showUtenteULinkScreen">
            <utenteUSLink  />
      </q-dialog> 
    </q-card>
</div>
</template>
<script setup>
import { ref,onMounted,inject,provide } from 'vue'
import { useQuasar, QSpinnerIos } from 'quasar'
// import Appointment from 'src/store/models/appointment/Appointment'
import Utente from 'src/stores/models/utente/Utente'
import CommunityMobilizer from '../../stores/models/mobilizer/CommunityMobilizer'
 import db from '../../stores/localbase'
 import Appointment from '../../stores/models/appointment/Appointment'
import moment from 'moment'
import isOnline from 'is-online'
import utenteUSLink from 'components/Utente/SearchSanitaryUnit.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import clinicService from '../../services/api/clinic/clinicService'
import communityMobilizerService from '../../services/api/mobilizer/CommunityMobilizerService'
import utenteService from 'src/services/api/utente/UtenteService'
import appointmentService from '../../services/api/appointment/appointmentService'

const show_dialog =ref(false)

const showUtenteULinkScreen = inject('showUtenteULinkScreen')
const showUtenteRegistrationScreen = inject('showUtenteRegistrationScreen')
const indexEdit = inject('indexEdit')
const utenteToEdit = inject('utenteToEdit')


const props = defineProps([
  'utentes'
]);

const { closeLoading, showloading } = useLoading();
const utente = ref({})
const timer = ref();
const confirm = ref(false);
const isOn = ref();
const $q = useQuasar();


const finalize = (reset) => {
timer.value = setTimeout(() => {
          reset()
        }, 100)
}

 const onLeft = ({ reset }, utenteOld) => {
        utenteOld.age = idadeCalculator(utenteOld.birthDate)
         $q.dialog({
              title: 'Confirmação',
              message: 'Pretende editar os dados do Utente?',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              cancel: {
              label: 'Cancelar',
              push: true,
              color: 'negative'
              },
              persistent: true
          }).onOk(() => {
            showUtenteRegistrationScreen.value = true
            indexEdit.value = 0
            utenteToEdit.value = utenteOld
          }).onCancel(() => {
              // console.log('>>>> Cancel')
               finalize(reset)
          }).onDismiss(() => {
            // this.finalize(reset)
              // console.log('I am triggered on both OK and Cancel')
          })
        // native Javascript event
        // console.log(evt)
      }

 const onBottom = ({ reset }, utenteOld) => {
     $q.dialog({
              title: 'Confirmação',
              message: 'Pretende apagar os dados do Utente?',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              cancel: {
              label: 'Cancelar',
              push: true,
              color: 'negative'
              },
              persistent: true
          }).onOk(() => {
              // db.newDb().collection('utentes').doc({ id: utenteOld.id }).delete()
              // Utente.delete(utenteOld.id)
              //  $emit('update:utente', utenteOld)
            //   this.finalize(reset)
            utenteService.deleteMobile(utenteOld.id)
            alertSucess('O Registo foi removido com sucesso');
          }).onCancel(() => {
              // console.log('>>>> Cancel')
               finalize(reset)
          }).onDismiss(() => {
            // this.finalize(reset)
              // console.log('I am triggered on both OK and Cancel')
          })
        // native Javascript event
        // console.log(evt)
      }


const onRight = ({ reset }, utente) => {
      if (utente.syncStatus === 'S') {
       $q.dialog({
              title: 'Informação',
              message: 'Não Pode Editar a consulta uma vez que esta já foi sincronizada',
              ok: {
              label: 'OK',
              push: true,
              color: 'blue'
              },
              persistent: true
          }).onOk(() => {
            finalize(reset)
          })
        } else {
           showloading();
         utente.appointments = []
         utente.status = 'ASSOCIADO'
         utente.communityMobilizer = {}
      //   utente.communityMobilizer = communityMobilizerService.getMobilizerById(localStorage.getItem('id_mobilizer'))
         utente.communityMobilizer_id = Number(localStorage.getItem('id_mobilizer'))
         utente.communityMobilizer.id = Number(localStorage.getItem('id_mobilizer'))
         console.log(appointmentService.getAppointmentByUtenteId(utente.id))
         appointmentService.deleteMobile(appointmentService.getAppointmentByUtenteId(utente.id).id)
          utenteService.putMobile(utente)
       //   this.finalize(reset)
          closeLoading()
      }
      }

const displayDate = (newDate) => {
   return moment(newDate).format('DD-MM-YYYY')
}

const activeUSForm = (open, utenteParam) => {
     if (open) {
          isOnlineChecker()
        }
        show_dialog.value = open
        utente.value = utenteParam
        showUtenteULinkScreen.value = true
}


const idadeCalculator = (birthDate) => {
     if (moment(birthDate).isValid()) {
               const utentBirthDate = moment(birthDate)
               const todayDate = moment(new Date())
               const idade = todayDate.diff(utentBirthDate, 'years')
               return idade
            }
}

const clinicLocal = (id) => {
 return  clinicService.getByClinicId(id)
}

const isOnlineChecker = async () => {
  showloading()
    await isOnline().then(resp => {
        if (resp === true) {
         isOn.value = true
        closeLoading()
        } else {
           isOn.value = false
              closeLoading()
        }
      }).catch(error => {
            closeLoading()
        console.log(error)
      })
}
onMounted(() => {
  showloading();
  isOnlineChecker();
});


provide('showUtenteULinkScreen', showUtenteULinkScreen);
provide('showUtenteRegistrationScreen', showUtenteRegistrationScreen);
provide('utente', utente);
provide('isOn', isOn);
provide('utenteToEdit', utenteToEdit);
</script>



<style scoped>
.span-pendente {
font-size: 15x;
font-weight: bold;
color: rgb(252, 4, 4);
animation: blink 1s linear infinite;
}
@keyframes blink {
0%{opacity: 0.1;}
50%{opacity: .5;}
100%{opacity: 1;}
}
</style>
