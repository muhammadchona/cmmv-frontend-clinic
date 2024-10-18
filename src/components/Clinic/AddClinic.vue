<template>
  <div class="row q-mb-md" v-if="showAddButton">
    <q-select
      dense
      rounded
      outlined
      class="col"
      v-model="province"
      :options="provinces"
      transition-show="flip-up"
      transition-hide="flip-down"
      ref="provinceRef"
      option-value="id"
      option-label="description"
      @update:model-value="onChangeProvincia()"
      :rules="[(val) => val != null || ' Por favor indique a província']"
      lazy-rules
      label="Província"
    />
    <q-select
      dense
      rounded
      outlined
      class="col q-ml-md"
      transition-show="flip-up"
      transition-hide="flip-down"
      v-model="district"
      :options="districtsCombo"
      ref="districtRef"
      option-value="id"
      option-label="description"
      :rules="[(val) => val != null || ' Por favor indique a Distrito']"
      lazy-rules
      label="Distrito"
    />
  </div>
  <div class="q-pt-xl">
    <q-table
      title="Unidade Sanitária"
      :rows="clinicos"
      :columns="columns"
      row-key="id"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Pesquisa"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="type" :props="props">
            <div class="text-pre-wrap">{{ props.row.type }}</div>
          </q-td>
          <q-td key="district" :props="props">
            <div class="text-pre-wrap">
              {{
                props.row.district !== undefined && props.row.district !== null
                  ? props.row.district.description
                  : ''
              }}
            </div>
          </q-td>
          <q-td key="active" :props="props">
            {{ props.row.active === true ? 'Sim' : 'Não' }}
          </q-td>
          <q-td key="actions" :props="props">
            <div class="q-gutter-sm">
              <q-btn
                round
                icon="edit"
                color="orange"
                size="sm"
                no-caps
                @click.stop="editClinic(props.row)"
              >
                <q-tooltip
                  content-class="bg-white text-primary shadow-4"
                  :offset="[10, 10]"
                  transition-show="rotate"
                  transition-hide="rotate"
                >
                </q-tooltip>
              </q-btn>
              <q-btn
                round
                size="sm"
                class="q-ml-lg"
                :color="getColorActive(props.row)"
                :icon="getIconActive(props.row)"
                @click.stop="promptToConfirm(props.row)"
              >
                <q-tooltip :class="getTooltipClass(props.row)">{{
                  props.row.active ? 'Inactivar' : 'Activar'
                }}</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="absolute-bottom">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          size="xl"
          fab
          icon="add"
          @click="addClinic()"
          no-cap
          color="primary"
          v-if="showAddButton"
        />
      </q-page-sticky>
    </div>
  </div>
  <q-dialog v-model="show_dialog" persistent>
    <q-card class="q-pt-lg" style="width: 1100px; max-width: 90vw">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle1 flex-center text-width-strong">
          Cadastrar Unidade Sanitária
        </q-toolbar-title>
        <q-btn
          flat
          v-close-popup
          round
          dense
          icon="close"
          @click="show_dialog = false"
        />
      </q-toolbar>
      <form @submit.prevent="validateClinic">
        <q-card-section class="q-px-md">
          <div class="row q-mt-md">
            <q-input
              dense
              rounded
              outlined
              ref="codeRef"
              v-model="newClinic.code"
              :rules="[
                (val) => val.length > 0 || 'o Codigo indicado ja existe',
              ]"
              lazy-rules
              class="col fild-radius"
              label="Codigo"
            />
          </div>
          <div class="row q-mt-md">
            <q-input
              dense
              rounded
              outlined
              ref="nomeRef"
              v-model="newClinic.name"
              :rules="[
                (val) => val.length >= 3 || 'O nome indicado é inválido',
              ]"
              lazy-rules
              class="col fild-radius"
              label="Nome"
            />
          </div>
          <div class="row q-mb-md">
            <q-select
              dense
              rounded
              outlined
              class="col"
              v-model="newClinic.type"
              :options="clinicTypes"
              transition-show="flip-up"
              transition-hide="flip-down"
              ref="clinicTypeRef"
              :rules="[(val) => val.length > 0 || ' Por favor indique o tipo']"
              lazy-rules
              label="Tipo de Unidade Sanitaria"
            />
          </div>
          <div class="row q-mb-md">
            <q-select
              dense
              rounded
              outlined
              class="col"
              v-model="newClinic.province"
              :options="provinces"
              @update:model-value="onChangeNewClinicProvincia()"
              transition-show="flip-up"
              transition-hide="flip-down"
              ref="provinceRef"
              option-value="id"
              option-label="description"
              :rules="[
                (val) => val != null || ' Por favor indique a província',
              ]"
              lazy-rules
              label="Província"
            />
          </div>
          <div class="row q-mb-md">
            <q-select
              dense
              rounded
              outlined
              class="col"
              transition-show="flip-up"
              transition-hide="flip-down"
              v-model="newClinic.district"
              :options="districts"
              ref="districtRef"
              option-value="id"
              option-label="description"
              :rules="[
                (val) => val != null || ' Por favor indique a Distrito/Cidade',
              ]"
              lazy-rules
              label="Distrito/Cidade"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-2">
              <q-btn
                push
                dense
                color="white"
                text-color="black"
                round
                icon="my_location"
                @click="locateMe"
              />
            </div>
            <div class="col-4 q-pl-md">
              <q-input
                dense
                rounded
                lazy-rules
                label="Latitude"
                ref="latitudeRef"
                outlined
                v-model="newClinic.latitude"
                :rules="[(val) => !!val || 'O Campo é obrigatório']"
              />
            </div>
            <div class="col-4 q-pl-md">
              <q-input
                dense
                rounded
                lazy-rules
                outlined
                v-model="newClinic.longitude"
                label="Longitude"
                ref="longitudeRef"
                :rules="[(val) => !!val || 'O Campo é obrigatório']"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-md">
          <q-btn
            type="submit"
            :loading="submitting"
            label="Submeter"
            color="primary"
          />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, onMounted, computed, ref } from 'vue';
import { useQuasar, QSpinnerIos } from 'quasar';
import { useLoading } from 'src/composables/shared/loading/loading';
import clinicService from 'src/services/api/clinic/clinicService';
import provinceService from 'src/services/api/province/provinceService';
import districtService from 'src/services/api/district/districtService';
import Clinic from '../../stores/models/clinic/Clinic';
import { useSwal } from 'src/composables/shared/dialog/dialog';
const { alertWarningAction, alertError, alertSucess } = useSwal();

const { closeLoading } = useLoading();
const props = defineProps(['clinic', 'backToDashBoard']);

const filter = ref('');
const $q = useQuasar();

const show_dialog = ref(false);
const showAddButton = ref(false);
const submitting = ref(false);
let editedIndex = -1;
const databaseCodes = ref([]);
const listErrors = ref([]);
const currClinic = ref({});
const district = ref(null);
const nomeRef = ref(null);
const codeRef = ref(null);
const clinicTypeRef = ref(null);
const provinceRef = ref(null);
const districtRef = ref(null);
const latitudeRef = ref(null);
const longitudeRef = ref(null);
const errorStr = ref(null);
let province = ref(null);
let initialDistrict = 0;
const newClinic = ref({});

let columns = [
  {
    name: 'name',
    align: 'left',
    label: 'Nome',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'type',
    align: 'left',
    label: 'Tipo',
    field: (row) => row.type,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'district',
    align: 'left',
    label: 'Distrito',
    field: (row) => row.district,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'active',
    align: 'left',
    label: 'Activo',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'actions', label: 'Opções', field: 'actions' },
];

const clinicTypes = ['', 'Unidade fixa', 'Unidade temporária', 'Clínica móvel'];

onBeforeMount(() => {
  currClinic.value = Object.assign({}, newClinic);
  // showloading()
});

onMounted(() => {
  const offset = 0;
  if (localStorage.getItem('role') === 'ROLE_USER') {
    // getClinicById()
  } else if (localStorage.getItem('role') === 'ROLE_ADMIN') {
    //  getAllClinic(offset)
  } else {
    getAllClinicsByDistrictId(localStorage.getItem('idLogin'));
  }
  getAllProvinces(offset);
  extractDatabaseCodes();
  verifyRole();
  closeLoading();
});

const clinicos = computed(() => {
  if (district.value != null) {
    return getClinicsByDistrictId();
  } else if (localStorage.getItem('role') === 'ROLE_USER') {
    return clinicService.getClinicSByUser(
      parseInt(localStorage.getItem('id_clinicUser'))
    );
  } else {
    return [];
  }
});

const provinces = computed(() => {
  return provinceService.getAllProvinces();
});

const districts = computed(() => {
  if (
    newClinic.value.province !== null &&
    newClinic.value.province !== undefined
  ) {
    return districtService.getAllByProvinceId(newClinic.value.province.id);
  } else {
    return null;
  }
});

const districtsCombo = computed(() => {
  if (province.value !== null) {
    return districtService.getAllByProvinceId(province.value.id);
  } else {
    return null;
  }
});

const onChangeProvincia = () => {
  district.value = null;
};

const onChangeNewClinicProvincia = () => {
  newClinic.value.district = null;
};

const locateMe = async (val) => {
  // showloading();
  console.log(val);
  // gettingLocation.value = true;
  try {
    // gettingLocation.value = false;
    location.value = await getLocation();
    console.log(location.value);
    newClinic.value.latitude = location.value.coords.latitude;
    newClinic.value.longitude = location.value.coords.longitude;
    closeLoading();
  } catch (e) {
    //  gettingLocation.value = false;
    errorStr.value = e.message;
    newClinic.value.latitude = -25.9678239;
    newClinic.value.longitude = 32.5864914;
    // console.log(myLocation);
    closeLoading();
    alertInfo(
      'Não tem permissões ou a função de localização do dispositivo encontra-se desligada.\n Por favor dê as permissões ou ligue a localização.'
    ).then((result) => {
      if (result) {
        newClinic.value.latitude = -25.9678239;
        newClinic.value.longitude = 32.5864914;
        console.log(myLocation);
        closeLoading();
      }
    });
  }
};

const getLocation = async (val) => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(
        new Error(
          'Localização Geográfica não está disponível. Por favor, ligue a Localização Geográfica no seu dispositivo.'
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

const validateClinic = () => {
  nomeRef.value.validate();
  codeRef.value.validate();
  latitudeRef.value.validate();
  longitudeRef.value.validate();
  clinicTypeRef.value.validate();
  provinceRef.value.validate();
  districtRef.value.validate();
  if (
    !nomeRef.value.hasError &&
    !latitudeRef.value.hasError &&
    !longitudeRef.value.hasError &&
    !codeRef.value.hasError
  ) {
    submitting.value = true;
    submitClinic();
  }
};

const getClinicsByDistrictId = () => {
  if (district.value != null && initialDistrict !== district.value.id) {
    $q.loading.show({
      spinner: QSpinnerIos,
      message: 'Carregando Unidades Sanitarias. Por favor, aguarde...',
    });
    initialDistrict = district.value.id;
    clinicService.getAllClinicsByDistrictId(district.value.id).then((resp) => {
      $q.loading.hide();
      console.log(resp);
    });
  }
  return clinicService.getLocalClinicsByDistrictId(district.value.id);
};

const submitClinic = async () => {
  if (editedIndex !== 0) {
    clinicService
      .post(newClinic.value)
      .then((resp) => {
        $q.notify({
          message: 'Clínica registrada com sucesso.',
          color: 'teal',
        });
        submitting.value = false;
        show_dialog.value = false;
      })
      .catch((error) => {
        submitting.value = false;
        console.log(error);
        if (error.request.status !== 0) {
          const arrayErrors = JSON.parse(error.request.response);
          if (arrayErrors.total == null) {
            listErrors.value.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.value.push(element.message);
            });
          }
          $q.notify({
            message: 'Error: ' + listErrors.value,
            color: 'red',
          });
          console.log(listErrors.value);
        }
      });
  } else {
    await clinicService
      .patch(newClinic.value.id, newClinic.value)
      .then((resp) => {
        console.log(resp);
        show_dialog.value = false;
        submitting.value = false;
        $q.notify({
          message: 'Clínica actualizada com sucesso.',
          color: 'teal',
        });
        show_dialog.value = false;
      })
      .catch((error) => {
        submitting.value = false;
        console.log(error);
        if (error.request.status !== 0) {
          const arrayErrors = JSON.parse(error.request.response);
          if (arrayErrors.total == null) {
            listErrors.value.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.value.push(element.message);
            });
          }
          $q.notify({
            message: 'Error: ' + listErrors.value,
            color: 'red',
          });
          console.log(listErrors.value);
        }
      });
    editedIndex = -1;
    listErrors.value = [];
  }
};

const addClinic = () => {
  newClinic.value = new Clinic();

  if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    newClinic.value.district = districtService.getDistrictByIdLogin(
      localStorage.getItem('idLogin')
    );
    newClinic.value.province = newClinic.value.district.province;
  }
  newClinic.value.active = true;
  show_dialog.value = true;
};

const getAllProvinces = async (offset) => {
  provinceService.get(0);
};

const verifyRole = () => {
  if (
    localStorage.getItem('role') === 'ROLE_USER_DISTRICT' ||
    localStorage.getItem('role') === 'ROLE_ADMIN'
  ) {
    showAddButton.value = true;
  }
  closeLoading();
};

const editClinic = (clinic) => {
  editedIndex = 0;
  newClinic.value = Object.assign({}, clinic);
  newClinic.value.province = provinceService.getProviceById(
    newClinic.value.district.province_id
  );
  show_dialog.value = true;
};

const extractDatabaseCodes = () => {
  clinicos.value.forEach((element) => {
    databaseCodes.value.push(element.code);
  });
};

const getIconActive = (clinic) => {
  if (clinic.active) {
    return 'toggle_off';
  } else if (!clinic.active) {
    return 'toggle_on';
  }
};
const getColorActive = (clinic) => {
  if (clinic.active) {
    return 'red';
  } else if (!clinic.active) {
    return 'green';
  }
};
const getTooltipClass = (clinic) => {
  if (clinic.active) {
    return 'bg-red-5';
  } else if (!clinic.active) {
    return 'bg-green-5';
  }
};

const promptToConfirm = (clinicParam) => {
  const question = clinicParam.active
    ? 'Deseja Inactivar a Clínica?'
    : 'Deseja Activar o Clínica?';

  alertWarningAction(question).then((response) => {
    if (response) {
      if (clinicParam.active) {
        clinicParam.active = false;
      } else {
        clinicParam.active = true;
      }
      clinicService
        .patch(clinicParam.id, clinicParam)
        .then(() => {
          alertSucess('Clínica actualizado com sucesso.');
        })
        .catch(() => {
          alertError('Aconteceu um erro inesperado ao actualizar o Clínica.');
        });
      // }
    }
  });
};

const navRedirect = (e, go) => {
  e.preventDefault(); // we cancel the default navigation
  go({ query: { tab: '2', noScroll: true } });
};
</script>

<style>
.fild-radius {
  border-radius: 5px;
}
</style>
