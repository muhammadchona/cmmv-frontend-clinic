<template>
  <q-page>
    <q-card
      :square="false"
      style="
        background: radial-gradient(circle at left, #e9bfb1 10%, #ee764e 100%);
        border-bottom-left-radius: 100em;
        border-bottom-right-radius: 100em;
      "
    >
      <div class="row q-py-lg q-ml-lg">
        <q-btn
          flat
          round
          color="white"
          icon="chevron_left"
          @click="$emit('previousScreen')"
        />
      </div>
      <div class="row q-pa-xl texte-center q-mt-lg column">
        <div
          style="font-family: 'Arial'; font-size: 40px; font-weight: bold"
          class="row text-center column text-white q-mb-md"
        >
          BEM VINDO
        </div>
        <div
          class="row text-center column text-white text-subtitle1 text-weight-bold"
        >
          Sistema móvel de <br />
          Geração de Demanada para a Circuncisão <br />Masculina
        </div>
      </div>
    </q-card>

    <div class="row q-mt-md text-center q-px-xl" v-if="!administration">
      <q-tabs
        v-model="tab"
        dense
        visible="false"
        class="text-grey userTab col"
        active-color="white"
        indicator-color="primary"
        active-bg-color="primary"
        narrow-indicator
        style="border-radius: 2em; border-style: solid; border-color: #ee764e"
        align="justify"
      >
        <q-tab
          style="border-radius: 2em; border-style: solid; border-color: white"
          name="clinic"
          icon="local_hospital"
          :label="usName"
        />
        <q-tab
          style="border-radius: 2em; border-style: solid; border-color: white;"
          name="Administração"
          icon="manage_accounts"
          label="Administração" />
      </q-tabs>
    </div>
    <form @submit.prevent="authUser">
      <div class="q-pa-xl">
        <div class="row q-mb-md">
          <q-input
            class="col"
            ref="usernameRef"
            v-model="username"
            outlined
            type="text"
            :rules="[
              (val) =>
                val.length >= 3 ||
                'O nome do utilizador deve ter um minimo de 3 caracteres',
            ]"
            lazy-rules
            rounded
            label="Utilizador"
          >
            <template v-slot:append>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>
        </div>
        <div class="row q-mb-md">
          <q-input
            v-model="password"
            rounded
            outlined
            class="col"
            label="Senha"
            :rules="[
              (val) =>
                val.length >= 4 || 'A senha deve ter um minimo de 4 caracteres',
            ]"
            ref="passwordRef"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="primary"
              />
            </template>
          </q-input>
        </div>
        <div class="row">
          <q-btn
            :loading="submitting"
            class="full-width q-py-sm"
            unelevated
            rounded
            color="primary"
            type="submit"
            label="Entrar"
          />
        </div>
        <div class="row q-py-lg float-right">
          <span class="text-h7"
            >Esqueceu as suas credenciais?
            <q-btn
              flat
              style="color: #ff0080"
              color="primary"
              label="Clique aqui."
              no-caps
          /></span>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import provinceService from '../../services/api/province/provinceService';
import districtService from '../../services/api/district/districtService';
import clinicService from '../../services/api/clinic/clinicService';
import { useRouter } from 'vue-router';
import usersService from 'src/services/UsersService';
import { Notify } from 'quasar';
const isPwd = ref(true);
const tab = ref('clinic');
const username = ref('');
const password = ref('');
const administration = ref(false);
const submitting = ref(false);
const { closeLoading, showloading } = useLoading();
const usernameRef = ref(null);
const passwordRef = ref(null);
const router = useRouter();
const usName = ref('Unidade Sanitaria');
const mainClinic = ref();

//OnMouted
onMounted(() => {
  showloading();
  init();
});

const init = async () => {
  const clinicIdParam = localStorage.getItem('clinicId');
  if (clinicIdParam) {
    const clin = clinicService.getByClinicId(clinicIdParam);
    if (clin) {
      localStorage.setItem('mainClinic', JSON.stringify(clin));
    }
  }
  const clinicFromLocal = localStorage.getItem('mainClinic');

  if (clinicFromLocal != null) {
    const parsedClinic = JSON.parse(clinicFromLocal);
    mainClinic.value = parsedClinic;
    usName.value = mainClinic.value.name;
  }
  closeLoading();
};

const addLocalDbClinics = async (districtId) => {
  return await clinicService.getAllClinicsByDistrictId(districtId)
};

const addLocalDbDistricts = () => {
  districtService.getWeb(0);
};

const addLocalDbProvince = () => {
  provinceService.getWeb(0);
};

const addLocalDbDatas = (districtId) => {
  addLocalDbClinics(districtId);
  addLocalDbDistricts();
  addLocalDbProvince();
};

const buildUserToAdd = (responseUser) => {
  const userLogin = {
    id: responseUser.id,
    id_token: responseUser.access_token,
    refresh_token: responseUser.refresh_token,
    username: responseUser.username,
    password: responseUser.password,
    idLogin: responseUser.mainEntity,
    mobilizer_id: responseUser.mainEntity,
    clinic_id: responseUser.mainEntity,
    role: responseUser.roles,
    clinic_id: responseUser.clinicId,
    district_id: responseUser.districtId,
    source: responseUser.source,
  };
  usersService.putMobile(userLogin);
};

const authUser = async () => {
  usernameRef.value.validate();
  passwordRef.value.validate();
  if (!passwordRef.value.hasError && !usernameRef.value.hasError) {
    loginOnline();
    submitting.value = true;
  }
};

const loginOnline = () => {
  usersService
    .login({ username: username.value, password: password.value })
    .then((response) => {
      localStorage.setItem('id_token', response.data.access_token);
      localStorage.setItem('idLogin', response.data.mainEntity);
      localStorage.setItem('idUser', response.data.id);
      localStorage.setItem('orgaoId', response.data.orgaoId);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('password', response.data.password);
      localStorage.setItem('role', response.data.roles);
      localStorage.setItem('clinicId', response.data.clinicId);
      localStorage.setItem('districtId', response.data.districtId);
      localStorage.setItem('source', response.data.source);
      if (
        tab.value === 'clinic' &&
        (response.data.roles.includes('ROLE_USER') ||
          response.data.roles.includes('ROLE_ADMIN'))
      ) {
        localStorage.setItem('id_clinicUser', localStorage.getItem('idLogin'));
        buildUserToAdd(response.data);
        addLocalDbDatas(response.data.districtId);
        submitting.value = false;
        router.push({ path: '/clinicHome/' + localStorage.getItem('idLogin') });
      } else if(tab.value !== 'clinic'){
        buildUserToAdd(response.data);
        localStorage.setItem('id_districtUser', response.data.idLogin);
        localStorage.setItem('id_clinicUser', 1)
        submitting.value = false;
        router.push({ path: '/administrationHome/' + 1 });
      }
    })
    .catch((error) => {
      submitting.value = false;
      if (error.request.response != null) {
        const arrayErrors = JSON.parse(error.request.response);
        if (arrayErrors.total == null) {
          listErrors.push(arrayErrors.message);
        } else {
          arrayErrors._embedded.errors.forEach((element) => {
            listErrors.push(element.message);
          });
        }
        console.log(listErrors);
      }else {
        Notify.create({
          icon: 'announcement',
          message: 'Utilizador sem acesso',
          type: 'negative',
          progress: true,
          timeout: 3000,
          position: 'top',
          color: 'negative',
          textColor: 'white',
          classes: 'glossy',
        });
        submitting.value = false;
      }
    });
};

provide('mainClinic', mainClinic);
</script>

<style>
.userTab {
  border: 1px solid gray-7;
}
</style>
