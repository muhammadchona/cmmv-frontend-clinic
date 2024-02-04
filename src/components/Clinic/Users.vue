<template>
  <div class="q-pt-xl">
    <q-table
      title="Utilizadores"
      :rows="users"
      :columns="columns"
      row-key="id"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Pesquisa">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="fullName" :props="props">
            {{ props.row.fullName !== undefined && props.row.fullName !== null && props.row.fullName !== '' ? props.row.fullName : 'Sem Info.'
            }}
          </q-td>
          <q-td key="username" :props="props">
            <div class="text-pre-wrap">{{ props.row.username }}</div>
          </q-td>
          <q-td key="actions" :props="props">
            <div class="q-gutter-sm">
              <!--  <q-btn round icon="edit" color="orange" size=sm no-caps @click.stop="editUser(props.row)">
                          <q-tooltip class="bg-grey-5">Editar</q-tooltip>
                </q-btn>  -->
              <!--q-btn round glossy icon="delete_forever" color="red" size=sm no-caps>
                <q-tooltip content-class="bg-red text-white shadow-4"
                          :offset="[10, 10]"
                          transition-show="rotate"
                          transition-hide="rotate">
                </q-tooltip>
                </q-btn-->
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="absolute-bottom">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn size="xl" fab icon="add" @click="addUser" no-cap color="primary" />
      </q-page-sticky>
    </div>
    <!--q-table title="Unidade Sanitária" :data="clinicos" :columns="columns" row-key="name" binary-state-sort :filter="filter">
      <template v-slot:top-right>
      <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Pesquisa">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
      <div class="q-pa-md q-gutter-sm">
      <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter=!show_filter" flat/>
        <q-btn outline rounded color="primary" icon="add" @click="show_dialog = true" no-caps/>
      </div>
      </template>
    </q-table-->
  </div>
  <q-dialog v-model="show_dialog" persistent>
    <q-card style="width: 700px; max-width: 80vw;" class="q-pt-lg">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1 flex-center text-width-strong">Cadastrar Utilizador</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close" @click="show_dialog = false" />
      </q-toolbar>
      <form @submit.prevent="validateUser">
        <q-card-section class="q-px-md">
          <div class="row q-mt-md">
            <q-input
              ref="nomeRef"
              dense
              square
              outlined
              v-model="user.firstNames"
              :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
              lazy-rules
              class="col fild-radius"
              label="Nome" />
          </div>
          <div class="row">
            <q-input
              class="col"
              ref="apelidoRef"
              dense
              square
              outlined
              v-model="user.lastNames"
              :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
              lazy-rules
              label="Apelido" />
          </div>
          <div class="row q-mt-md">
            <q-input
              ref="usernameRef"
              dense
              square
              outlined
              v-model="user.username"
              :rules="[ val => val.length >= 3 || 'O nome do utilizador indicado é inválido']"
              lazy-rules
              class="col fild-radius"
              label="Nome de Utilizador" />
          </div>
          <div class="row">
            <q-input
              v-model="user.password"
              dense
              rounded
              outlined
              square
              class="col"
              label="Senha"
              :rules="[ val => val.length >= 4 || 'A senha deve ter um minimo de 4 caracteres']"
              ref="passwordRef"
              :type="isPwd ? 'password' : 'text'">
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
          <div class="row q-mb-md" v-if="!hideFields">
            <q-select
              dense outlined
              class="col"
              v-model="user.role"
              :options="userRoles"
              transition-show="flip-up"
              transition-hide="flip-down"
              ref="roleRef"
              :rules="[ val => ( val != null ) || ' Por favor indique o role do utilizador']"
              lazy-rules
              label="Perfil *" />
          </div>
          <div class="row q-mb-md" v-if="!hideFields">
            <q-select
              dense
              outlined
              class="col"
              :options="provinces"
              v-model="province"
              transition-show="flip-up"
              transition-hide="flip-down"
              ref="provinceRef"
              :disable="disableFields"
              option-value="id"
              option-label="description"
              :rules="[ val => ( val != null ) || ' Por favor indique a província']"
              lazy-rules
              label="Província" />
          </div>
          <div class="row q-mb-md" v-if="!hideFields">
            <q-select
              dense outlined
              class="col"
              transition-show="flip-up"
              transition-hide="flip-down"
              v-model="district"
              :options="districts"
              ref="districtRef"
              :disable="disableFields"
              option-value="id"
              option-label="description"
              :rules="[ val => ( val != null) || ' Por favor indique a Distrito/Cidade']"
              lazy-rules
              label="Distrito" />
          </div>
          <div class="row q-mb-md" v-if="isRoleAdm === true">
            <q-select
              dense outlined
              class="col"
              :options="displayClinics"
              v-model="user.clinic"
              transition-show="flip-up"
              transition-hide="flip-down"
              ref="clinica"
              option-value="id"
              option-label="name"
              :rules="[ val => ( val != null ) || ' Por favor indique a Clinica']"
              lazy-rules
              label="Unidade Sanitária" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-md">
          <q-btn label="Cancelar" color="primary" @click="show_dialog = false" />
          <q-btn type="submit" :loading="submitting" label="Submeter" color="primary" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
  <q-dialog v-model="show_error_dialog">
    <div v-if="listErrors.length > 0" class="q-pa-sm q-gutter-sm"
         style="max-width: 550px; max-height: 150px;border-radius: 10px; border: 1px solid #cb4646; margin: 5px; background-color: #ead8da">
      <ul class="list-group alert alert-danger">
        <li class="list-group-item text-negative q-pl-xs text-weight-regular text-caption"
            v-for="item in listErrors" :key="item">
          {{ item }}
        </li>
      </ul>
    </div>
  </q-dialog>
</template>
<script setup>
import usersService from 'src/services/UsersService';
import provinceService from 'src/services/api/province/provinceService';
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { UserLogin } from 'src/stores/models/userLogin/UserLogin';
import { DistrictUserLogin } from 'src/stores/models/userLogin/DistrictUserLogin';
import userLoginService from 'src/services/api/userLogin/userLoginService';
import { ref, onMounted, computed } from 'vue';
import clinicService from 'src/services/api/clinic/clinicService';
import districtService from 'src/services/api/district/districtService';

const { alertSucess, alertError, alertInfo } = useSwal();
const { closeLoading, showloading } = useLoading();
const columns = [
  {
    name: 'fullName',
    align: 'left',
    label: 'Nome Completo',
    field: row => row.fullName,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'username',
    align: 'left',
    label: 'Utilizador',
    field: row => row.username,
    format: val => `${val}`,
    sortable: true
  }
];


const user = ref({});
const userDistrict = new DistrictUserLogin();

const nomeRef = ref(null);
const apelidoRef = ref(null);
const passwordRef = ref(null);
const provinceRef = ref(null);
const districtRef = ref(null);
const roleRef = ref(null);
const usernameRef = ref(null);

const isPwd = ref(true);
const province = ref(null);
const district = ref(null);
const show_dialog = ref(null);
const show_error_dialog = ref(false);
const editMode = ref(false);
const submitting = ref(false);
const listErrors = ref([]);
const disableFields = ref(false);
const hideFields = ref(false);
const initialDistrict = ref(0);
const filter = ref('');
const userRoles = ref(['Utilizador na US', 'Administrador Distrital']);

onMounted(() => {
  showloading();
  // getAllProvinces()
  if (localStorage.getItem('role') === 'ROLE_ADMIN') {
    usersService.apiGetAll();
  } else if (localStorage.getItem('role') === 'ROLE_USER') {
    usersService.getAllUsersByClinicId(localStorage.getItem('id_clinicUser'));
  } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    usersService.getAllUsersByDistrictId(localStorage.getItem('idLogin'));
  }
  closeLoading();
});

const provinces = computed(() => {
  return provinceService.getAllProvinces();
});


const districts = computed(() => {
  if (province.value !== null) {
    return districtService.getAllByProvinceId(province.value.id);
  } else {
    return null;
  }
});

const displayClinics = computed(() => {
  if (district.value != null) {
    return clinicService.getLocalClinicsByDistrictId(district.value.id);
  } else {
    return [];
  }
});


const isRoleAdm = computed(() => {
  if (user.value.role === 'Utilizador na US' && localStorage.getItem('role') !== 'ROLE_USER') {
    return true;
  }
  return false;
});

const users = computed(() => {
  return userLoginService.getAllUsers();
});

const getAllUsersByClinicId = async (clinicId) => {
  return await usersService.getAllUsersByClinicId(clinicId);
};

const getAllUsersByDistrictId = async (districtId) => {
  return await usersService.getAllUsersByDistrictId(districtId);
};

const getAllClinicsByDistrictId = async (districtId) => {
  return await clinicService.getAllClinicsByDistrictId(districtId);
};

const validateUser = () => {

  if (!hideFields.value) {
    provinceRef.value.validate();
    districtRef.value.validate();
    roleRef.value.validate();
  }
  nomeRef.value.validate();
  apelidoRef.value.validate();
  usernameRef.value.validate();
  passwordRef.value.validate();


  if (!hideFields.value) {

    if (
      !nomeRef.value.hasError &&
      !apelidoRef.value.hasError &&
      !provinceRef.value.hasError &&
      !districtRef.value.hasError &&
      !roleRef.value.hasError &&
      !passwordRef.value.hasError &&
      !usernameRef.value.hasError
    ) {
      submitUser();
    }

  } else {
    if (
      !nomeRef.value.hasError &&
      !apelidoRef.value.hasError &&
      !passwordRef.value.hasError &&
      !usernameRef.value.hasError
    ) {
      submitUser();
    }

  }


};

const submitUser = () => {
  submitting.value = true;
  listErrors.value = [];
  user.value.fullName = user.value.firstNames + ' ' + user.value.lastNames;
  if (user.value.role === 'Administrador Distrital') {
    //  user = DistrictLogin()
    userDistrict = Object.assign({}, user);
    userDistrict.province = province;
    userDistrict.district = district;
  }
  let idLastUserLogin = 0;
  try {
    idLastUserLogin = userLoginService.getAllUsers()[0].id + 1;
  } catch (error) {
    idLastUserLogin = 1;
  }
  user.value.id = idLastUserLogin;
  usersService.postWeb(getStringUserType(user), getObjectToSend(user)).then(resp => {
    console.log(resp.response.data);
    show_dialog.value = false;
    submitting.value = false;
    alertSucess('Utilizador registrado com sucesso.');
  })
};

const addUser = () => {
  user.value = new UserLogin();
  if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    user.value.role = 'Utilizador na US';
    district.value = District.query().with('province').find(localStorage.getItem('idLogin'));
    province.value = district.value.province;
    disableFields.value = true;
    hideFields.value = true;
  } else if (localStorage.getItem('role') === 'ROLE_USER') {
    user.value.role = 'Utilizador na US';
    user.value.clinic = clinicService.getClinicByUse(localStorage.getItem('id_clinicUser')); // Clinic.query().with('province').with('district.province').find(localStorage.getItem('id_clinicUser'))
    province.value = user.value.clinic.district.province;
    district.value = user.value.clinic.district;
    disableFields.value = true;
    hideFields.value = true;
  }
  // user.value.role = 'Utilizador Clinica'
  show_dialog.value = true;
};

const editUser = (user) => {
  editedIndex.value = 0;
  user.value = Object.assign({}, user.value);
  show_dialog.value = true;
};

const getStringUserType = (user) => {
  if (user.value.role === 'Utilizador na US') {
    return '/userLogin';
  } else if (user.value.role === 'Administrador Distrital') {
    return '/districtUserLogin';
  } else if (user.value.role === 'Mobilizador') {
    return '/mobilizerLogin';
  }
};

const getObjectToSend = (user) => {
  if (user.value.role === 'Utilizador na US') {
    return user.value;
  } else if (user.value.role === 'Administrador Distrital') {
    return userDistrict;
  } else if (user.value.role === 'Mobilizador') {
    return '/mobilizerLogin';
  }
};


</script>
<style>
.fild-radius {
  border-radius: 5px;
}
</style>
