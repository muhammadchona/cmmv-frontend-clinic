<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <div class="q-pa-sm q-gutter-sm">
      <q-header class="bg-primary">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle1 flex-center"
            >Ligar o Utente a uma Unidade Sanitária</q-toolbar-title
          >
          <q-btn
            flat
            v-close-popup
            round
            dense
            icon="close"
            @click="closeRegistration(false)"
          />
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding>
          <q-card>
            <q-card-section>
              <q-item-section class="flex-center">
                <q-avatar size="100px">
                  <q-img src="../../assets/userLogedIn.jpg" />
                </q-avatar>
              </q-item-section>
              <div class="text-h5 text-center">
                {{ utente.firstNames }} {{ utente.lastNames }}
              </div>
              <div class="text-subtitle1 text-grey text-center">
                {{ utente.cellNumber }}
              </div>
            </q-card-section>
          </q-card>
          <q-separator />
          <div
            class="col q-pa-lg text-subtitle1 text-weight-bolder flex-center ellipsis"
          >
            Associar a Unidade Sanitária Preferida
          </div>
          <q-separator />
          <div>
            <q-stepper
              v-model="step"
              ref="stepper"
              alternative-labels
              color="primary"
              animated
            >
              <q-step
                :name="1"
                icon="my_location"
                title="1º Passo"
                :done="step > 1"
                v-if="isOn"
                :header-nav="step > 1"
              >
                <div class="col text-subtitle1 text-weight-bolder ellipsis">
                  Minha localização e Raio de Pesquisa de US
                </div>
                <q-separator />
                <div class="row q-pa-sm q-gutter-sm">
                  <q-btn
                    push
                    flat
                    color="white"
                    text-color="black"
                    round
                    icon="my_location"
                    @click="locateMe"
                  />
                  <q-input
                    readonly
                    v-model="myLocation.latitude"
                    label="Latitude"
                  />
                  <q-input
                    readonly
                    v-model="myLocation.longitude"
                    label="Longitude"
                  />
                </div>
                <div class="q-gutter-md">
                  <q-select
                    v-model="myLocation.distance"
                    :disable="myLocation.longitude.length <= 0"
                    :options="rangekm"
                    label="Raio de Pesquisa"
                  />
                </div>
                <q-stepper-navigation class="row justify-center">
                  <q-btn
                    flat
                    icon-right="navigate_next"
                    :disable="myLocation.distance.length <= 0"
                    @click="
                      () => {
                        getClinicInRange('K');
                        done1 = true;
                        step = 2;
                      }
                    "
                    color="primary"
                    label="Próximo"
                  />
                </q-stepper-navigation>
              </q-step>
              <q-step
                :name="2"
                title="2º Passo"
                icon="place"
                :done="step > 2"
                :header-nav="step > 2"
              >
                <q-list
                  v-if="clinics.length > 0"
                  bordered
                  padding
                  class="rounded-borders text-primary"
                >
                  <q-item
                    v-for="clinic in clinics"
                    :key="clinic.id"
                    clickable
                    v-ripple
                    :active="link === clinic"
                    @click="link = clinic"
                    active-class="my-menu-link"
                  >
                    <q-item-section avatar>
                      <q-icon name="place" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ clinic.name }}</q-item-label>
                      <q-item-label caption>{{ clinic.type }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top v-if="isOn">
                      <q-item-label>{{ clinic.distance }}Km</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-list v-else separator>
                  <q-item v-ripple>
                    <q-item-section avatar>
                      <q-icon color="red" name="mood_bad" />
                    </q-item-section>
                    <q-item-section class="text-left"
                      >Sem resultados na lista</q-item-section
                    >
                  </q-item>
                </q-list>
                <q-stepper-navigation class="row justify-center">
                  <q-btn
                    flat
                    icon="chevron_left"
                    @click="step = 1"
                    color="primary"
                    label="voltar"
                    class="q-ml-sm"
                    v-if="isOn"
                  />
                  <q-btn
                    flat
                    icon-right="chevron_right"
                    :disable="link.length >= 0"
                    @click="
                      () => {
                        done2 = true;
                        step = 3;
                      }
                    "
                    color="primary"
                    label="Próximo"
                  />
                </q-stepper-navigation>
              </q-step>
              <q-step
                :name="3"
                title="3º Passo"
                icon="book_online"
                :header-nav="step > 3"
              >
                <div class="col text-subtitle1 text-weight-bolder ellipsis">
                  Marcação da Consulta
                </div>
                <q-separator />
                <div class="q-pa-sm q-gutter-md row items-start justify-center">
                  <q-input
                    v-model="appointment.appointmentDate"
                    label="Data da Consulta"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          transition-show="scale"
                          transition-hide="scale"
                          ref="qDateProxy"
                        >
                          <q-date
                            v-model="appointment.appointmentDate"
                            :options="blockDataPassado"
                            mask="DD-MM-YYYY"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Fechar"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <q-stepper-navigation class="row justify-center">
                  <q-btn
                    flat
                    icon="chevron_left"
                    @click="step = 2"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                  <q-btn
                    rounded
                    color="primary"
                    :loading="submitting"
                    :disable="appointment.appointmentDate.length <= 0"
                    @click="
                      () => {
                        associar();
                        done3 = true;
                        submitting = true;
                      }
                    "
                    label="Associar"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </div>
        </q-page>
      </q-page-container>
    </div>
  </q-layout>
</template>
<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue';
import { date, useQuasar, QSpinnerIos } from 'quasar';
//import Clinic from '../../store/models/clinic/Clinic'
// import Appointment from 'src/store/models/appointment/Appointment'
// import CommunityMobilizer from 'src/stores/models/mobilizer/CommunityMobilizer'
import moment from 'moment';
import Utente from '../../stores/models/utente/Utente';
import Appointment from '../../stores/models/appointment/Appointment';
// import District from '../../store/models/district/District'
// import { UserLogin } from '../../store/models/userLogin/UserLoginHierarchy'
import { v4 as uuidv4 } from 'uuid';
import isOnline from 'is-online';
import utenteService from '../../services/api/utente/UtenteService';
import communityMobilizerService from '../../services/api/mobilizer/CommunityMobilizerService';
import { useRouter } from 'vue-router';
// import db from 'src/store/localbase'
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import clinicService from '../../services/api/clinic/clinicService';
import appointmentService from '../../services/api/appointment/appointmentService';
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Unidade Sanitária',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'distance',
    align: 'center',
    label: 'Distancia',
    field: (row) => row.distance,
    format: (val) => `${val}`,
    sortable: true,
  },
];
const { closeLoading, showloading } = useLoading();
const { alertSucess, alertError, alertInfo, alertWarningAction } = useSwal();
const router = useRouter();
const filter = ref('');
const selected = ref([]);
const stepper = ref();
const step = ref(1);
const link = ref('');
const clinics = ref([]);
const submitting = ref(false);
const location = ref(null);
const gettingLocation = ref(false);
const errorStr = ref(null);
const showUtenteULinkScreen = inject('showUtenteULinkScreen');
const showUtenteRegistrationScreen = inject('showUtenteRegistrationScreen');
const utente = inject('utente');
const isOn = inject('isOn');
const mobilizer = inject('mobilizer');

const hourOptionsTime1 = ref([8, 9, 10, 11, 12, 13, 14]);
const minuteOptionsTime1 = ref([0, 15, 30, 45]);
const myLocation = ref({
  latitude: '',
  longitude: '',
  distance: '',
});

const rangekm = ['<1km', '1km - 5km', '5km - 10km', '>10km'];
const appointment = ref(new Appointment());

const optionsFn = (newDate) => {
  return newDate >= date.formatDate(new Date(), 'YYYY-MM-DD HH:mm');
};

/*
const showdialog = computed({
 get() {
      return showUtenteULinkScreen
      },
      set (showUtenteULinkScreen) {
       emit('update:showdialog', showUtenteULinkScreen)
      },
});
*/
const relatedUtente = computed({
  get() {
    return utente.value;
  },
  set(utente) {
    utente.update(utente);
    emit('update:utente', utente);
  },
});

const date1 = ref(moment(date).format('YYYY/MM/DD'));

const blockDataPassado = (date) => {
  return date >= moment(new Date()).format('YYYY/MM/DD');
};

onMounted(() => {
  // showloading();
  // isOnlineChecker();
});

const associar = async () => {
  const newDate = new Date(appointment.value.appointmentDate, 'DD-MM-YYYY');
  relatedUtente.value.clinic = link.value;
  relatedUtente.value.status = 'ENVIADO';
  if (
    relatedUtente.value.syncStatus === 'S' ||
    relatedUtente.value.syncStatus === 'U' ||
    relatedUtente.value.syncStatus === null
  ) {
    relatedUtente.value.syncStatus = 'U';
  } else {
    relatedUtente.value.syncStatus = 'P';
  }
  appointment.value.id = uuidv4();
  appointment.value.clinic = link.value;
  appointment.value.status = 'PENDENTE';
  appointment.value.hasHappened = false;
  appointment.value.orderNumber = 1;
  appointment.value.visitDate = null;
  appointment.value.appointmentDate = moment(
    appointment.value.appointmentDate,
    'DD-MM-YYYY'
  ).format('YYYY-MM-DD');
  appointment.value.time = newDate.getHours() + ':' + newDate.getMinutes();
  appointment.value.utente = {};
  appointment.value.utente.id = utente.value.id;
  appointment.value.utente_id = utente.value.id;
  const appointmentLocalBase = JSON.parse(JSON.stringify(appointment.value));
  relatedUtente.value.appointments.push(appointmentLocalBase);
  const relatedUtenteLocalBase = JSON.parse(
    JSON.stringify(relatedUtente.value)
  );
  appointmentService.putMobile(appointmentLocalBase);
  utenteService.putMobile(relatedUtenteLocalBase);

  console.log(appointment.value);
  submitting.value = false;
  closeRegistration(false);
  // $emit('update:utente', relatedUtente)
};

const closeRegistration = (close) => {
  // showdialog.value = ref(close)
  step.value = 1;
  appointment.value = {};
  submitting.value = false;
  showUtenteULinkScreen.value = false;
  //  emit('update:showDialog', false)
  //    //  emit('update:showUtenteULinkScreen', close)
};

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(
        new Error(
          'Localização Geográfica não está disponível.' +
            'Por favor, ligue a Localização Geográfica no seu dispositivo.'
        )
      );
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(pos);
      },
      (err) => {
        reject(err);
      }
    );
  });
};

const locateMe = async () => {
  showloading();
  gettingLocation.value = true;
  try {
    gettingLocation.value = false;
    location.value = await getLocation();
    myLocation.value.latitude = location.value.coords.latitude;
    myLocation.value.longitude = location.value.coords.longitude;
    closeLoading();
  } catch (e) {
    gettingLocation.value = false;
    errorStr.value = e.message;
    closeLoading();
    alertWarningAction(
      'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização'
    ).then((result) => {
      if (result) {
        address.value.latitude = -25.9678239;
        address.value.longitude = 32.5864914;
        closeLoading();
      }
    });
  }
};

const getDistance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const getClinicInRange = (unit) => {
  let calcDist = 0;
  let clinic = {};
  clinics.value = [];
  console.log(myLocation.value.distance);
  console.log(
    clinicService.getLocalClinicsByDistrictId(mobilizer.value.district_id)
  );
  for (clinic of clinicService.getLocalClinicsByDistrictId(
    mobilizer.value.district_id
  )) {
    console.log(clinic);
    if (clinic.longitude !== undefined && clinic.longitude !== null) {
      if (myLocation.value.distance.includes('<1km')) {
        calcDist = getDistance(
          myLocation.value.latitude,
          myLocation.value.longitude,
          clinic.latitude,
          clinic.longitude,
          unit
        );
        if (calcDist <= 1000) {
          clinic.distance = round(calcDist / 1000, 3);
          clinics.value.push(clinic);
        }
      } else {
        if (myLocation.value.distance.includes('1km - 5km')) {
          calcDist = getDistance(
            myLocation.value.latitude,
            myLocation.value.longitude,
            clinic.latitude,
            clinic.longitude,
            unit
          );
          if (calcDist > 1000 && calcDist <= 5000) {
            clinic.distance = round(calcDist / 1000, 2);
            clinics.value.push(clinic);
          }
        } else {
          if (myLocation.value.distance.includes('5km - 10km')) {
            calcDist = getDistance(
              myLocation.value.latitude,
              myLocation.value.longitude,
              clinic.latitude,
              clinic.longitude,
              unit
            );
            console.log(calcDist);
            if (calcDist > 5000 && calcDist <= 10000) {
              clinic.distance = round(calcDist / 1000, 2);
              clinics.value.push(clinic);
            }
          } else {
            calcDist = getDistance(
              myLocation.value.latitude,
              myLocation.value.longitude,
              clinic.latitude,
              clinic.longitude,
              unit
            );
            if (calcDist > 10000) {
              clinic.distance = round(calcDist / 100, 2);
              clinics.value.push(clinic);
            }
          }
        }
      }
    }
  }
  return clinics;
};

watch(
  () => showUtenteULinkScreen.value,
  console.log('Prop changed: ', ' | was: '),
  () => {
    if (!isOn) {
      getClinicInRange('K');
      done1 = true;
      step.value = 2;
    } else {
      done1 = false;
      step.value = 1;
    }
    if (
      myLocation.value.latitude !== undefined &&
      myLocation.value.latitude !== null
    ) {
      myLocation.value.latitude = '';
      myLocation.value.longitude = '';
      myLocation.value.distance = '';
      link = ref('');
      appointment.value.appointmentDate = '';
      submitting.value = false;
    }
  }
);

//    props: ['utente', 'showUtenteULinkScreen', 'activeUSForm', 'isOn', 'showDialog'],
//   emits: ['update:showUtenteULinkScreen', 'update:utente', 'update:utente.appointments'],
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: #f5997a
</style>
