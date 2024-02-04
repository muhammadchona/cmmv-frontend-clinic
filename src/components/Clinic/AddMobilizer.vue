<template>
  <q-card style="width: 700px; max-width: 80vw;" class="q-pt-lg">
        <form @submit.prevent="validateMobilizer" >
            <q-card-section class="q-px-md">
               <div class="row q-mt-md">
                <q-input
                    ref="nomeRef"
                    label="Nome *"
                    dense
                    square
                   outlined
                    v-model="mobilizer.firstNames"
                    :rules="[ val => val.length >= 3 || 'O nome indicado é inválido']"
                    lazy-rules
                    class="col fild-radius" />
            </div>
            <div class="row">
                <q-input
                    class="col"
                    ref="apelidoRef"
                    dense
                    square
                  outlined
                    v-model="mobilizer.lastNames"
                    :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
                    lazy-rules
                    label="Apelido *" />
            </div>
            <div class="row">
             <input-phone-code
                dense
                square
                  outlined
                    class="col-2">
            </input-phone-code>
                <q-input
                    class="col q-ml-md"
                    mask="#########"
                    ref="phoneRef"
                    type="tel"
                    dense
                   rounded
                   outlined
                     :rules="[ val => phoneRules (val)]"
                    v-model="mobilizer.cellNumber"
                    label="Número de Telefone" />
            </div>
             <div class="row">
<input-phone-code
                dense
                square
                  outlined
                    class="col-2">
            </input-phone-code>
                <q-input
                    class="col q-ml-md"
                    ref="cellNumber2Ref"
                    mask="#########"
                    dense
                   square
                   outlined
                    lazy-rules
                     :rules="[ val => secondNumberRules (val)]"
                    v-model="mobilizer.cellNumber2"
                    label="Número de Telefone Alternativo" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    dense outlined
                    class="col"
                    v-model="province"
                    :options="provinces"
                     :disable=editModeMobilizer
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="provinceRef"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província *" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense outlined
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="mobilizer.district"
                      :disable=editModeMobilizer
                    :options="districts"
                    ref="districtRef"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique o Distrito']"
                    lazy-rules
                    label="Distrito" />
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
               <q-btn label="Cancelar" color="primary" @click="$emit('close')"/>
                <q-btn type="submit" :loading="submitting" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>
<script setup>
import { QSpinnerIos } from 'quasar'
import { ref,onMounted,computed,onBeforeUnmount,provide } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import communityMobilizerService from '../../services/api/mobilizer/CommunityMobilizerService'
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import inputPhoneCode from 'components/Shared/IconPhoneCode.vue';
import provinceService from '../../services/api/province/provinceService'
import districtService from '../../services/api/district/districtService';

const { closeLoading, showloading } = useLoading();
const { alertSucess, alertError, alertInfo, alertWarningAction } = useSwal();
const mobilizer = new CommunityMobilizer()
const province = ref(null)
const show_dialog = ref(false)
const submitting = ref(false)
const show_error_dialog = ref(false)
const listErrors = ref([])
const selectedMobilizer = inject('mobilizer');
const editModeMobilizer = inject('editModeMobilizer');

const nomeRef = ref(null);
const apelidoRef = ref(null);
const phoneRef = ref(null);
const provinceRef = ref(null);
const districtRef = ref(null);
const cellNumber2Ref = ref(null);

const provinces =  computed(() => {
  return provinceService.getAllProvinces();
});

const districts =  computed(() => {
    if (province.value !== null) {
  return districtService.getAllByProvinceId(province.value.id);
    } else {
        return null
    }
});


const validateMobilizer = () => {
  nomeRef.value.validate();
  apelidoRef.value.validate();
  phoneRef.value.validate();
  cellNumber2Ref.value.validate();
  provinceRef.value.validate();
  districtRef.value.validate();

  if (
    !nomeRef.value.hasError &&
    !apelidoRef.value.hasError &&
    !provinceRef.value.hasError &&
    !phoneRef.value.hasError &&
    !districtRef.value.hasError &&
    !cellNumber2Ref.value.hasError
  ) {
                submitMobilizer()
            }
}

const phoneRules = (val) => {
       if (val.length === 0 || val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
       } else if (validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
       }
}

const validatePhonePrefix = (val) => {
       if ((val !== 82) && (val !== 83) && (val !== 84) && (val !== 85) && (val !== 86) && (val !== 87)) {
             return true
         }
}


const secondNumberRules = (val) => {
  if (val.length !== 0 && val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
      } else if (val.length !== 0 && validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
      }
}

const submitMobilizer = () => {
     mobilizer.uuid = uuidv4()
            submitting.value = false
            listErrors.value = []
            console.log(mobilizer.value)
       if (mobilizer.value.id === null) {
        communityMobilizerService.postWeb(mobilizer.value).then(() => {
        alertSucess('Mobilizador registrado com sucesso.');
        submitting.value = false;
        show_dialog.value = false
      }).catch(error => {
        submitting.value = false;
        show_dialog.value = true
            console.log(error)
            if (error.request.status !== 0) {
            const arrayErrors = JSON.parse(error.request.response)
            if (arrayErrors.total == null) {
              listErrors.value.push(arrayErrors.message)
            } else {
              arrayErrors._embedded.errors.forEach(element => {
                listErrors.value.push(element.message)
              })
            }
            }
            alertError('Ocorreu um problema ao gravar o Mobilizador');
            })
       } else if (editModeMobilizer) {
        const mobilizadorMobile = JSON.parse(JSON.stringify(mobilizer.value))
         communityMobilizerService.putMobile(mobilizadorMobile)
         alertSucess('Mobilizador actualizado com sucesso.');
         show_dialog.value = false
       } else if (editMode) {
        communityMobilizerService.patchWeb(mobilizer.value,mobilizer.value.id).then(() => { 
          alertSucess('Mobilizador foi actualizado com sucesso.');
        }).catch(error => {
                console.log(error)
                show_dialog.value = false
                submitting.value = false
            })
       }
}
onMounted(() => {
 // showloading();
 // getMobilizer();
    //   provinceService.get(0);
   // districtService.get(0);
 // init();
  mobilizer.value = Object.assign({}, selectedMobilizer.value)
     if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
      mobilizer.value.district = districtService.getById(localStorage.getItem('idLogin'))
       province.value = mobilizer.value.district.province
     } else {
        mobilizer.value.district = mobilizer.value.district_id
        if (mobilizer.value.district != null) province.value = mobilizer.value.district.province
     }
});

/*
props: ['selectedMobilizer', 'editModeMobilizer', 'editMode'],
      emits: ['update:show_dialog'],
      */
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
 