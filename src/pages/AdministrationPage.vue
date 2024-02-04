<template>
  <q-layout view="hHh lpR fFf">
    <div class="q-pa-sm">
      <q-header class="q-py-sm">
        <q-toolbar>
          <q-toolbar-title>
            <div
              class="text-weight- q-mt-md qmr-sr text-weight-bold"
              v-if="isUser"
            >
              {{ mainClinic.name }} [CMMV]
            </div>
            <div
              class="text-weight-thin"
              v-if="isUser && displayClinic() !== null"
            >
              {{ displayClinic().name }}
            </div>
            <div
              class="text-weight- q-mt-md qmr-sr text-weight-bold absolute-center"
              v-if="isAdmin || isAdminDistrict"
            >
              Administração
            </div>
            <div class="text-weight-thin" v-if="isAdminDistrict">
              {{ displayDistrict().description }}
            </div>
          </q-toolbar-title>
          <div class="absolute-right items-center q-mt-sm">
            <q-avatar size="lg">
              <img src="~assets/userLogedIn.jpg" />
            </q-avatar>
            <q-btn flat icon="expand_more">
              <q-menu transition-show="scale" transition-hide="scale">
                <q-list style="min-width: 120px">
                  <q-item clickable>
                    <q-item-section
                      @click="showChangePasswordScreen = true"
                      clickable
                      >Alterar Senha</q-item-section
                    >
                  </q-item>
                  <q-separator />
                  <q-item to="/" clickable>
                    <q-item-section>Sair</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>
      <div class="q-gutter-y-lg">
        <UserMessage :userName="username" />
      </div>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="configuracoes">
          <Settings />
        </q-tab-panel>
      </q-tab-panels>
      <q-footer>
        <q-toolbar>
          <q-tabs v-model="tab" class="absolute-center">
            <q-tab name="configuracoes" icon="settings" label="Definições" />
          </q-tabs>
        </q-toolbar>
      </q-footer>
    </div>
    <q-dialog persistent v-model="showChangePasswordScreen">
      <changePassword @close="showChangePasswordScreen = false" />
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';
import SyncronizingService from '../services/SyncronizingService';
import { Notify, useQuasar } from 'quasar';
import isOnline from 'is-online';
import Appointment from 'src/stores/models/appointment/Appointment';
import Utente from 'src/stores/models/utente/Utente';

// Components
 import Settings from 'components/Clinic/Settings.vue';
import UserMessage from 'components/Clinic/UserMessage.vue';
import clinicService from 'src/services/api/clinic/clinicService';
import districtService from 'src/services/api/district/districtService';
import changePassword from 'components/Shared/ChangePassword.vue';

const $q = useQuasar();
const timerToSyncronizeConst = ref(0);
const tab = ref('configuracoes');
const showChangePasswordScreen = ref(false);
const username = ref('');
const isAdmin = ref(false);
const isAdminDistrict = ref(false);
const isUser = ref(false);
const mainClinic = ref(JSON.parse(localStorage.getItem('mainClinic')))

const displayClinic = () => {
  return clinicService.getByClinicId(localStorage.getItem('id_clinicUser'));
};

const displayDistrict = () => {
  return districtService.getDistrictByIdLogin(localStorage.getItem('idLogin'));
};
const getAllUtentesByDistrictId = async (districtId) => {
  await Utente.api()
    .get('/utente/address/' + districtId)
    .then((resp) => {
      console.log(resp.response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
const getAllAppointmentsByDistrictId = async (districtId) => {
  await Appointment.api()
    .get('/appointment/district/' + districtId)
    .then((resp) => {
      console.log(resp.response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
const getUserName = () => {
  username.value = localStorage.getItem('username');
};
const isOnlineChecker = async (sync) => {
  await isOnline()
    .then((resp) => {
      if (resp === true && sync === true) {
        verificationDialog();
      } else if (resp === false && sync === true) {
        Notify.create({
          icon: 'announcement',
          message:
            'Não Possui conectividade com a internet , sincronização não efectuda',
          type: 'negative',
          progress: true,
          timeout: 3000,
          position: 'top',
          color: 'negative',
          textColor: 'white',
          classes: 'glossy',
        });
      } else if (resp === true && sync === false) {
        Notify.create({
          icon: 'announcement',
          message: 'Aplicativo Online',
          type: 'positive',
          progress: true,
          timeout: 5000,
          position: 'top',
          color: 'positive',
          textColor: 'white',
          classes: 'glossy',
        });
      } else if (resp === false && sync === false) {
        Notify.create({
          icon: 'announcement',
          message: 'Aplicativo offline',
          type: 'negative',
          progress: true,
          timeout: 5000,
          position: 'top',
          color: 'negative',
          textColor: 'white',
          classes: 'glossy',
        });
      }
    })
    .catch((error) => {
      $q.loading.hide();
      console.log(error);
    });
};
const verificationDialog = () => {
  $q.dialog({
    title: 'Confirmação',
    message:
      'Tem a certeza que deseja efectuar a sincronização? Os dados enviados já não poderão ser editados após a sincronização',
    ok: {
      label: 'OK',
      push: true,
      color: 'blue',
    },
    cancel: {
      label: 'Cancelar',
      push: true,
      color: 'negative',
    },
    persistent: true,
  })
    .onOk(() => {
      SyncronizingService.sendAppointmentsClinicData();
      SyncronizingService.getAppointmentsClinicData();
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
const checkOnlineToSync1 = () => {
  isOnline().then((resp) => {
    if (resp === true) {
      SyncronizingService.sendAppointmentsClinicData();
      SyncronizingService.getAppointmentsClinicData();
    } else if (resp === false) {
      return false;
    }
  });
};
const timerToSyncronize = () => {
  timerToSyncronizeConst.value = setInterval(() => {
    checkOnlineToSync1();
  }, 3600000); // 3600000 timer to sycronize hour to hour
};

onBeforeUnmount(() => {
  clearInterval(timerToSyncronizeConst.value);
}),
onMounted(() => {
  getUserName();
  clinicService.get(0);
  isOnlineChecker(false);
  if (localStorage.getItem('role') === 'ROLE_ADMIN') {
    tab.value = 'configuracoes';
    isAdmin.value = true;
    isAdminDistrict.value = false;
  } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    tab.value = 'configuracoes';
    isAdmin.value = false;
    isAdminDistrict.value = true;
    getAllUtentesByDistrictId(localStorage.getItem('idLogin'));
    getAllAppointmentsByDistrictId(localStorage.getItem('idLogin'));
  } else if (localStorage.getItem('role') === 'ROLE_USER') {
    isUser.value = true;
    isAdmin.value = false;
    isAdminDistrict.value = false;
    timerToSyncronize();
  }
});
</script>

<style></style>
