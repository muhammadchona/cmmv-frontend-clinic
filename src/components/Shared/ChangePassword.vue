<template>
    <q-card style="width: 500px; max-width: 80vw;" class="q-pt-lg">
        <form @submit.prevent="validateUser" >
            <q-card-section class="q-px-md">
             <h5 center> Alterar Senha</h5>
               <div class="row q-mt-md">
               <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" label="Senha Actual" ref="passwordRef"  class="col"   :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            <div class="row">
               <q-input v-model="newPassword" filled :type="isPwd ? 'password' : 'text'" label="Nova Senha" class="col" ref="newPasswordRef" :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            <div class="row">
               <q-input v-model="confirmNewPassword" filled :type="isPwd ? 'password' : 'text'" label="Confirmação da Nova Senha"  class="col" ref="confirmNewPasswordRef" :rules="[ val => ( val != null ) || ' Por favor preencha a senha']">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
            </div>
            </q-card-section>
           <q-card-actions align="right" class="q-mb-md">
               <q-btn label="Cancelar" color="primary" @click="emit('close')"/>
                <q-btn type="submit" :loading="submitting" label="Submeter" color="primary" />
            </q-card-actions>
        </form>
    </q-card>
</template>
<script setup>
import { ref } from 'vue'
import bcrypt from 'bcryptjs'
import UsersService from 'src/services/UsersService';
// import db from 'src/store/localbase'
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertSucess } = useSwal();
const password = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const passwordRef = ref(null);
const newPasswordRef = ref(null);
const confirmNewPasswordRef = ref(null);
const isPwd = ref(true)
const submitting = ref(false)
// const dataBaseUser = ref({})


const validateUser = () => {
  submitting.value = true
  passwordRef.value.validate()
  newPasswordRef.value.validate()
  confirmNewPasswordRef.value.validate()

   if (!passwordRef.value.hasError && !newPasswordRef.value.hasError &&
            !confirmNewPasswordRef.value.hasError) {
              const match = bcrypt.compareSync(password.value, dataBaseUser.value.password.substring(8))
              if (match) {
                if (newPassword.value === confirmNewPassword.value) {
             const hash = bcrypt.hashSync(newPassword, 12)
                 dataBaseUser.value.password = '{bcrypt}' + hash
                    const localBaseUser = JSON.parse(JSON.stringify(dataBaseUser))
        UsersService.putMobile(localBaseUser)
        alertSucess('A senha foi actualizado com sucesso.')
         emit('close')
                }
              }
               submitting.value = false
            }
}

const dataBaseUser = () => {
  return UsersService.getUserByUserName(localStorage.getItem('user'));
}



onMounted(() => {
 // getLocalBaseUser()
});



</script>