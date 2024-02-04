<template>
    <q-page>
        <div class="  full-width full-height column" >
            <mainScreen
                v-if="showMainScreen"
                 @nextScreen="showMainScreen = false, showSecondScreen = true"
                @login="showLoginScreen = true, showMainScreen = false"/>
              <secondScreen
                v-if="showSecondScreen"
                @previousScreen="showSecondScreen = !showSecondScreen, showMainScreen = true"
                @nextScreen="showThirdScreen = true, showSecondScreen = false"/>
            <thirdScreen
                v-if="showThirdScreen"
                @previousScreen="showThirdScreen = !showThirdScreen, showSecondScreen = true"
                @nextScreen="showfourthScreen = true, showThirdScreen = false"/>
            <fourthScreen
                v-if="showfourthScreen"
                @previousScreen="showfourthScreen = !showfourthScreen, showThirdScreen = true"
                @nextScreen="showfifthScreen = true, showfourthScreen = false"/>
            <fifthScreen
                v-if="showfifthScreen"
                @previousScreen="showfifthScreen = !showfifthScreen, showfourthScreen = true"
                @nextScreen="showfifthScreen = false, showSixthScreen = true"/>
            <sixthScreen
                v-if="showSixthScreen"
                @previousScreen="showSixthScreen = !showSixthScreen, showfifthScreen = true"
                @nextScreen="showSixthScreen = false, showSeventhScreen = true"/>
            <seventhScreen
                v-if="showSeventhScreen"
                @previousScreen="showSeventhScreen = !showSeventhScreen, showSixthScreen = true"
                @nextScreen="showSeventhScreen = false,showEightScreen=true"
                @login="showLoginScreen = true, showSeventhScreen = false"/>

          <Login
                v-if="showLoginScreen"
                @goHome="goHome"
                @previousScreen="showLoginScreen = false, showMainScreen = true" />
        </div>
    </q-page>
</template>
<script setup>
import { ref } from 'vue';
import mainScreen from 'components/MainScreen/MainScreen.vue'
import secondScreen from 'components/MainScreen/SecondMainScreen.vue'
import thirdScreen from 'components/MainScreen/ThirdMainScreen.vue'
import fourthScreen from 'components/MainScreen/FourthMainScreen.vue'
import fifthScreen from 'components/MainScreen/FifthMainScreen.vue'
import sixthScreen from 'components/MainScreen/SixthMainScreen.vue'
import seventhScreen from 'components/MainScreen/SeventhMainScreen.vue'
// import utenteRegistration from 'components/Utente/UtenteRegistration.vue'
//import Addresss from 'components/Utente/Address.vue'
//import SuccessRegistration from 'components/Utente/SuccessRegistration.vue'
 import Login from 'components/Shared/Login.vue'
// import clinicSearch from 'components/Utente/SearchSanitaryUnit.vue'
// import appointment from 'components/Utente/Appointment.vue'



const showMainScreen = ref(true);
const showSecondScreen = ref(false);
const showThirdScreen = ref(false);
const showfourthScreen = ref(false);
const showfifthScreen = ref(false);
const showSixthScreen = ref(false);
const showSeventhScreen = ref(false);
const showEightScreen = ref(false);

// const componentParam = ref('');

/*
const saveUtente = (utente) => {
   userParent.value = utente
   showAddressScreen.value = false
   showSuccessRegistration.value = true
};

const proccedToAddress = (utente) => {
   userParent.value = utente
  showEightScreen.value = false
  showAddressScreen.value = true
};

const goHome = (utente) => {
   let ut
    Object.keys(utente).forEach(function (key) {
     ut = utente[key]
     })
     userParent.value = Object.assign({}, ut)
    console.log(userParent.value)
     showSuccessRegistration.value = false
     showLoginScreen.value = false
     showAppointmentScreen.value = false
     showHomeScreen.value = true
};

const searchClinic = (utente) => {
    userParent.value = utente
    showClinicSearchScreen.value = true
     showHomeScreen.value = false
};

const associarClinic = (utente) => {
      userParent.value = utente
     showClinicSearchScreen.value = false
     showHomeScreen.value = true
};

const makeAppointment = (utente) => {
    userParent.value = utente
   showHomeScreen.value = false 
   showAppointmentScreen.value = true
};

const rescheduleAppointment = (utente) => {
     currAppointment.value = appointment
    showHomeScreen.value = false
   showAppointmentScreen.value = true
};
*/
</script>
<style lang="scss">
</style>