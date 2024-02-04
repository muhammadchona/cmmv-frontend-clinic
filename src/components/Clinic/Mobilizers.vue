<template>
  <div class="row q-mb-md">
    <q-select
      dense
      rounded
      outlined
      class="col"
      v-model="province"
      :options="provinces"
      transition-show="flip-up"
      transition-hide="flip-down"
      ref="province"
      option-value="id"
      option-label="description"
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
      :options="districts"
      ref="district"
      option-value="id"
      option-label="description"
      :rules="[(val) => val != null || ' Por favor indique a Distrito']"
      lazy-rules
      label="Distrito"
    />
  </div>
  <div class="q-pt-xl">
    <q-table
      title="Mobilizadores"
      :rows="mobilizers"
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
          <q-td key="firstNames" :props="props">
            {{ props.row.firstNames }}
          </q-td>
          <q-td key="lastNames" :props="props">
            <div class="text-pre-wrap">{{ props.row.lastNames }}</div>
          </q-td>
          <q-td key="cellNumber" :props="props">
            <div class="text-pre-wrap">{{ props.row.cellNumber }}</div>
          </q-td>
          <q-td key="actions" :props="props">
            <div class="q-gutter-sm">
              <q-btn
                round
                icon="edit"
                color="orange"
                size="sm"
                no-caps
                @click.stop="editMobilizer(props.row)"
              >
                <q-tooltip class="bg-grey-5">Editar</q-tooltip>
              </q-btn>
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
        <q-btn
          size="xl"
          fab
          icon="add"
          @click="addMobilizer"
          no-cap
          color="primary"
        />
      </q-page-sticky>
    </div>
    <q-dialog persistent v-model="showMobilizerRegistrationScreen">
      <addMobilizerComp
        :selectedMobilizer="mobilizer"
        :editMode="editMode"
        @close="showMobilizerRegistrationScreen = false"
      />
    </q-dialog>
  </div>
</template>
<script setup>
import communityMobilizerService from 'src/services/api/mobilizer/CommunityMobilizerService';
import provinceService from 'src/services/api/province/provinceService';
import districtService from 'src/services/api/district/districtService';
import addMobilizerComp from 'components/Clinic/AddMobilizer.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { computed, onMounted, ref } from 'vue';

const columns = [
  {
    name: 'firstNames',
    align: 'left',
    label: 'Nome',
    field: (row) => row.firstNames,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'lastNames',
    align: 'left',
    label: 'Apelido',
    field: (row) => row.lastNames,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'cellNumber',
    align: 'left',
    label: 'Número de Telefone',
    field: (row) => row.cellNumber,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'actions', label: 'Opções', align: 'left', field: 'actions' },
];

const filter = ref('');
const { alertSucess, alertError, alertInfo } = useSwal();
const { closeLoading, showloading } = useLoading();
const mobilizer = ref('');
const province = ref(null);
const district = ref(null);
const showMobilizerRegistrationScreen = ref(null);
const editMode = ref(false);
const initialDistrict = ref(0);

onMounted(() => {
  // communityMobilizerService.apiFetchByDistrictId(
  //   localStorage.getItem('idLogin')
  // );
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

const mobilizers = computed(() => {
  if (district.value != null) {
    return getMobilizersByDistrictId();
  } else {
    return [];
  }
});

const getMobilizersByDistrictId = () => {
  if (district.value != null && initialDistrict.value !== district.value.id) {
    showloading();
    initialDistrict.value = district.value.id;
    communityMobilizerService
      .apiFetchByDistrictId(district.value.id)
      .then((resp) => {
        closeLoading();
      });
      return communityMobilizerService.getMobilizerByDistrictId(district.value.id)
  }else
    return []
};

const addMobilizer = () => {
  mobilizer.value = new CommunityMobilizer();
  showMobilizerRegistrationScreen.value = true;
  editMode.value = false;
};

const editMobilizer = (mobilizer) => {
  mobilizer.value = Object.assign({}, mobilizer);
  showMobilizerRegistrationScreen.value = true;
  editMode.value = true;
};

const getAllProvinces = () => {
  return provinceService.get(0);
};
</script>

<style>
.fild-radius {
  border-radius: 5px;
}
</style>
