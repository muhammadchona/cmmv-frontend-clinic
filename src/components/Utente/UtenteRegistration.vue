<template>
  <q-page-container>
  <q-page >
    <div class="row items-center q-mb-md bg-deep-orange-3">
        <div class="col q-my-sm">
            <q-btn
                flat
                round
                color="white"
                icon="chevron_left"
                @click="closeRegistrationVerification()"/>
        </div>
         <div class="row text-white text-weight-bolder justify-center">
            Registar Utente
        </div>
        <div class="col"><q-space /></div>
    </div>
    <form @submit.prevent="validateUtente">
        <div class="q-px-sm">
            <div class="row q-my-lg">Dados Pessoais</div>
            <div class="row">
              <q-input
              label="Nome *"
              dense
                rounded
               outlined
              class="col"
              ref="nomeRef"
              :rules="[(val) => !!val || 'Por favor indicar o nome']"
              v-model="utente.firstNames"
            />
            </div>
            <div class="row">
              <q-input
              label="Apelido *"
               dense
                rounded
               outlined
              class="col"
              ref="apelidoRef"
               :rules="[ val => val.length >= 2 || 'O apelido indicado é inválido']"
              v-model="utente.lastNames"
            />
            </div>
            <div class="row">
              <input-phone-code
                dense
                rounded
                  outlined
                    class="col-2">
            </input-phone-code>
                <q-input
                    class="col"
                    mask="#########"
                    ref="phoneRef"
                    dense
                   rounded
                   outlined
                    type="tel"
                    :rules="[ val => phoneRules (val)]"
                    v-model="utente.cellNumber"
                      lazy-rules
                    label="Número de Telefone" />
            </div>
            <div class="row">
            <input-phone-code
                dense
                rounded
                  outlined
                    class="col-2">
            </input-phone-code>
                <q-input
                    class="col"
                    ref="whatsappRef"
                    mask="#########"
                    dense
                   rounded
                   outlined
                    type="tel"
                      :rules="[ val => whatsapNumberRules(val)]"
                    v-model="utente.whatsappNumber"
                    label="Número de Telemovel com Whatsapp" />
            </div>
            <div class="column inline items-start example-container q-mr-sm">
                <div class="example-cell" tabindex="0"> Tem Parceira(o) ?
                    <q-radio keep-color color="orange" v-model="utente.haspartner" val="true" label="Sim" ref="hasPartnerYes" />
                    <q-radio keep-color color="orange" v-model="utente.haspartner" val="false" label="Não" ref="hasPartner"/>
                </div>
            </div>
            <div class="row q-mt-md" >
                <div class="col-8 q-pr-sm">
                    <q-input
                        dense
                        rounded outlined
                        v-model="dateOfBirth"
                        ref="birthDateRef"
                        label="Data de Nascimento"
                        @update:model-value="ageCalculator()">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                 <q-date
                                    mask="DD-MM-YYYY"
                                    v-model="dateOfBirth"
                                    :options="blockDataFutura"
                                    @update:model-value="ageCalculator()"
                                >
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                                    </div>

                                 </q-date>
                            </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
                <br>
                <div class="col-4 q-pl-sm">
                    <q-input
                        dense
                        label="Idade"
                        type="number"
                        ref="ageRef"
                        rounded outlined
                        v-model="ageCalculated"
                        :rules="[val => (val > 14 && val < 100) || 'Digite uma idade real e maior que 14 anos de idade']"
                        lazy-rules>
                        <template v-slot:append>
                            <q-icon
                            name="autorenew"
                            class="cursor-pointer"
                            @update:model-value="dateOfBirthCalculator()"/>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-my-lg">Endereço</div>
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense
                    outlined
                    rounded
                    v-model="selectedProvince"
                    :options="provinces"
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    ref="provinceRef"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null ) || ' Por favor indique a província']"
                    lazy-rules
                    label="Província" />
            </div>
            <div class="row q-mb-md">
                <q-select
                    class="col"
                    dense
                    outlined
                    rounded
                     transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="address.district"
                    :options="districts"
                    ref="districtRef"
                    option-value="id"
                    option-label="description"
                    :rules="[ val => ( val != null) || ' Por favor indique a Distrito/Cidade']"
                    lazy-rules
                    label="Distrito" />
            </div>
             <div class="row q-mb-md">
                <q-input
                    outlined
                    rounded
                    dense
                    class="col"
                    ref="bairroRef"
                    v-model="address.neighboorhood"
                    label="Bairro" />
            </div>
            <div class="row q-mb-md">
                <q-input
                    class="col"
                    v-model="address.residence"
                    :rules="[ val => (val.length > 0) || 'Por favor indique a residência']"
                    lazy-rules
                    outlined
                    dense
                    ref="moradaRef"
                    type="textarea"
                    label="Residência"
                    />
            </div>
            <div class="row q-my-lg">Minha localização</div>
            <q-separator/>
            <div class="row q-mb-md">
                <q-btn push flat color="white" text-color="black" round icon="my_location" @click="locateMe"/>
                <q-input readonly v-model="address.latitude" label="Latitude" ref="latitudeRef" />
                <q-input readonly v-model="address.longitude" label="Longitude" ref="longitudeRef" />
            </div>
        </div>
          <div class="absolute-bottom">
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn size="xl" fab icon="save" type="submit" color="primary" />
          </q-page-sticky>
        </div>
    </form>
  </q-page>
</q-page-container>
</template>
<script setup>
 import Utente from 'src/stores/models/utente/Utente'
// import Address from 'src/store/models/address/Address'
import { date } from 'quasar'
import { ref,onMounted, computed,inject } from 'vue'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
// import Localbase from 'localbase'
import Address from '../../stores/models/address/Address'
import utenteService from '../../services/api/utente/UtenteService'
import provinceService from '../../services/api/province/provinceService'
import districtService from '../../services/api/district/districtService'
import inputPhoneCode from 'components/Shared/IconPhoneCode.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import { useSwal } from 'src/composables/shared/dialog/dialog';
// import db from 'src/store/localbase'

const { closeLoading, showloading } = useLoading();
const { alertSucess, alertError, alertInfo, alertWarningAction } = useSwal();
//const hoje = ref(String(formatDateDDMMYYYY(new Date())))
const birthMinDate = ref(new Date())
const utente = ref(new Utente())
const ageText = ref('')
const currUtente = ref({})
const selectedProvince = ref(null)
const editedIndex = ref('')
const address = ref(new Address())

const location = ref(null)
const gettingLocation = ref(false)
const errorStr = ref(null)
const myLocation = ({
          latitude: '',
            longitude: '',
            distance: ''
})
const dateOfBirth = ref('');
const ageCalculated = ref('');
const indexEdit = inject('indexEdit')
const utenteToEdit = inject('utenteToEdit')

const date1 = ref(moment(date).format('YYYY/MM/DD'))

const nomeRef = ref(null);
const apelidoRef = ref(null);
const phoneRef = ref(null);
const birthDateRef = ref(null);
const whatsappRef = ref(null);
const provinceRef = ref(null);
const districtRef = ref(null);
const moradaRef = ref(null);
const bairroRef = ref(null);
const ageRef = ref(null);

 const showUtenteRegistrationScreen = inject('showUtenteRegistrationScreen')
 const mobilizer = inject('mobilizer')


 onMounted(() => {
  currUtente.value = Object.assign({}, utente.value)
      //  console.log(utenteToEdit.value)
        if (indexEdit.value === 0) {
            utente.value = Object.assign({}, utenteToEdit.value)
            utente.value.birthDate = moment(utenteToEdit.value.birthDate).format('DD-MM-YYYY')
            dateOfBirth.value = moment(utenteToEdit.value.birthDate).format(
      'DD-MM-YYYY'
    );
    ageCalculated.value = moment().diff(
      moment(getDateFromHyphenDDMMYYYY(dateOfBirth.value), 'YYYY-MM-DD'),
      'years'
    );
         //  idadeCalculator(utente.value.birthDate) // Calculo da idade do utente
           if (utente.value.haspartner === true) {
             utente.value.haspartner = ref('true')
           } else {
               utente.value.haspartner = ref('false')
           }
            if (utente.value.addresses.length > 0) {
                address.value = utente.value.addresses[0]
                address.value.district = districtService.getById(address.value.district_id)
               selectedProvince.value = address.value.district.province
            //    address.value.province_id = address.value.district.province.id
            }
        } 
  if (address.value.latitude === null & address.value.longitude === null) {
            locateMe()
  }
});

const provinces =  computed(() => {
  return provinceService.getAllProvinces();
});


const districts =  computed(() => {
    if (selectedProvince.value !== null) {
  return districtService.getAllByProvinceId(selectedProvince.value.id);
    } else {
        return null
    }
});


const dateOfBirthCalculator = () => {
  if (
    ageCalculated.value !== null &&
    ageCalculated.value !== undefined &&
    ageCalculated.value !== ''
  ) {
    dateOfBirth.value = moment(
      '01-01-' + (moment().year() - ageCalculated.value)
    ).format('DD-MM-YYYY');
  } else {
    dateOfBirth.value = '';
  }
};

const ageCalculator = () => {
  if (
    dateOfBirth.value !== null &&
    dateOfBirth.value !== undefined &&
    dateOfBirth.value !== ''
  ) {
    ageCalculated.value = moment().diff(
      moment(getDateFromHyphenDDMMYYYY(dateOfBirth.value), 'YYYY-MM-DD'),
      'years'
    );
  } else {
    ageCalculated.value = '';
  }
};
const formatDateDDMMYYYY = (value) => {
   return date.formatDate(value, 'DD-MM-YYYY')
}

const blockDataFutura = (date) => {
    return date <= moment(new Date()).format('YYYY/MM/DD')
}

const closeRegistration = (close) => {
  showloading()
            setTimeout(() => {
             closeLoading()
               // $emit('update:showUtenteRegistrationScreenProp', close)
               showUtenteRegistrationScreen.value=false
            }, 100)
}

const closeRegistrationVerification = () => {
 if ((address.value.province !== null && address.value.province !== undefined && address.value.province !== '') ||
                (address.value.residence !== null && address.value.residence !== undefined && address.value.residence.trim().length > 0) ||
                (utente.value.firstNames.length > 0) || (utente.value.lastNames.length > 0)) {
                    verificationDialog()
                } else {
                  showloading()
                    setTimeout(() => {
                    closeLoading()
                    showUtenteRegistrationScreen.value=false
                    }, 100)
            }
}

const verificationDialog = () => {
 alertWarningAction(
    'Pretende voltar ao ecrã anterior?'
  ).then((result) => {
    if (result) {
     utente.value = {}
   //  emit('update:showUtenteRegistrationScreenProp', false)
   showUtenteRegistrationScreen.value = false
    }
  });
}

const validateUtente = () => {

  nomeRef.value.validate();
  apelidoRef.value.validate();
  phoneRef.value.validate();
  birthDateRef.value.validate();
  whatsappRef.value.validate();
  provinceRef.value.validate();
  moradaRef.value.validate();
  bairroRef.value.validate();
  ageRef.value.validate();
  districtRef.value.validate();
  if (
    !nomeRef.value.hasError &&
    !apelidoRef.value.hasError &&
    !provinceRef.value.hasError &&
    !phoneRef.value.hasError &&
    !districtRef.value.hasError &&
    !whatsappRef.value.hasError &&
    !moradaRef.value.hasError &&
    !bairroRef.value.hasError &&
    !ageRef.value.hasError
  ) {
    saveOrUpdateUtente()
  }
}

const getYYYYMMDDFromJSDate = (jsDate ) => {
    return moment(jsDate).local().format('YYYY-MM-DD');
  }

const getDateFromHyphenDDMMYYYY = (jsDate) => {
    return date.extractDate(jsDate, 'DD-MM-YYYY');
}

const saveOrUpdateUtente = () => {
  /*
  const dateObject = getYYYYMMDDFromJSDate(
      getDateFromHyphenDDMMYYYY(dateOfBirth.value)
    );
*/
console.log(dateOfBirth.value)
  utente.value.birthDate = getYYYYMMDDFromJSDate(
    getDateFromHyphenDDMMYYYY(dateOfBirth.value)
  );
  utente.value.registerDate = new Date()
  console.log(utente.value.birthDate)

 // utente.value.communityMobilizer = mobilizer.value
  utente.value.communityMobilizer_id = mobilizer.value.id
  utente.value.communityMobilizer = {}
  utente.value.communityMobilizer.id = mobilizer.value.id

  if (utente.value.syncStatus === 'S' || utente.value.syncStatus === 'U') {
    utente.value.syncStatus = 'U'
     } else {
     utente.value.syncStatus = 'P'
      }

  utente.value.status = 'ASSOCIADO'
  utente.value.addresses.splice(0, 1, address.value)

          
            
        // utenteService.post(utente.value)
        if (indexEdit.value === 1) {
          utente.value.id = uuidv4()
        } 
       
        const utenteLocalBase = JSON.parse(JSON.stringify(utente.value))
     
        console.log(utenteLocalBase)
        utenteService.putMobile(utenteLocalBase)
       
            closeRegistration(false)
            }


const phoneRules = (val) => {
       if (val.length === 0 || val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
       } else if (validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
       }
}

const whatsapNumberRules = (val) => {
        if (val.length !== 0 && val.length < 9) {
      return 'O Número é invalido. Deve conter 9 dígitos.'
      } else if (val.length !== 0 && validatePhonePrefix(parseInt(val.substring(0, 2)))) {
           return 'O Número é invalido. O codigo da operadora não existe'
      }
}

const validatePhonePrefix = (val) => {
       if ((val !== 82) && (val !== 83) && (val !== 84) && (val !== 85) && (val !== 86) && (val !== 87)) {
             return true
         }
}

const editaUtente = (val) => {
     editedIndex.value = 0
      utente.value = Object.assign({}, utente.value)
      console.log(utente)
}

const getLocation = async (val) => {
       return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
              reject(new Error('Localização Geográfica não está disponível. Por favor, ligue a Localização Geográfica no seu dispositivo.'))
        }
        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos)
        }, err => {
          reject(err)
        })
      })
}

const locateMe = async (val) => {
       showloading()
       gettingLocation.value = true
      try {
        gettingLocation.value = false
        location.value = await getLocation()
        address.value.latitude = location.value.coords.latitude
        address.value.longitude = location.value.coords.longitude
       closeLoading()
      } catch (e) {
        gettingLocation.value = false
         errorStr.value = e.message
        closeLoading()
 alertWarningAction(
    'Não tem permissões para aceder a localização do dispositivo ou a função de localização encontra-se desligada.\n Por favor ligue a localização ou dê as permissões de localização'
  ).then((result) => {
    if (result) {
      address.value.latitude = -25.9678239
     address.value.longitude = 32.5864914
   closeLoading()
    }
  });
      }
}

// props: ['indexEdit', 'utenteUpdate', 'mobilizer', 'showUtenteRegistrationScreenProp', 'numbers'],
 //   emits: ['update:showUtenteRegistrationScreenProp'],
</script>
