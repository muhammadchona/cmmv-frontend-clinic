<template>
  <q-card style="width: 500px; max-width: 80vw" class="q-pt-lg">
    <form @submit.prevent="validateUser">
      <q-card-section class="q-px-md">
        <h5 center>Alterar Senha</h5>
        <div class="row q-mt-md">
          <q-input
            v-model="password"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Senha Actual"
            ref="passwordRef"
            class="col"
            :rules="[(val) => val != null || ' Por favor preencha a senha']"
          >
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
          <q-input
            v-model="newPassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Nova Senha"
            class="col"
            ref="newPasswordRef"
            :rules="[(val) => val != null || ' Por favor preencha a senha']"
          >
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
          <q-input
            v-model="confirmNewPassword"
            filled
            :type="isPwd ? 'password' : 'text'"
            label="Confirmação da Nova Senha"
            class="col"
            ref="confirmNewPasswordRef"
            :rules="[(val) => val != null || ' Por favor preencha a senha']"
          >
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
        <q-btn
          label="Cancelar"
          color="primary"
          @click="showChangePasswordScreen = false"
        />
        <q-btn
          type="submit"
          :loading="submitting"
          label="Submeter"
          color="primary"
        />
      </q-card-actions>
    </form>
  </q-card>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import bcrypt from 'bcryptjs';
import UsersService from 'src/services/UsersService';
// import db from 'src/store/localbase'
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertSucess, alertError } = useSwal();
const password = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const passwordRef = ref(null);
const newPasswordRef = ref(null);
const confirmNewPasswordRef = ref(null);
const isPwd = ref(true);
const submitting = ref(false);
const showChangePasswordScreen = inject('showChangePasswordScreen');

// const dataBaseUser = ref({})

const validateUser = async () => {
  submitting.value = true;
  passwordRef.value.validate();
  newPasswordRef.value.validate();
  confirmNewPasswordRef.value.validate();

  if (
    !passwordRef.value.hasError &&
    !newPasswordRef.value.hasError &&
    !confirmNewPasswordRef.value.hasError
  ) {
    const match = bcrypt.compareSync(
      password.value,
      localStorage.getItem('password').substring(8)
    );
    if (match) {
      if (newPassword.value === confirmNewPassword.value) {
        const user = await UsersService.apiGetUserById(
          localStorage.getItem('idUser')
        );
        user.password = newPassword.value;
        UsersService.updateUser(user.id, user)
          .then((resp) => {
            // closeLoading();
            alertSucess('A senha foi actualizada com sucesso.');
            localStorage.setItem('password', resp.data.password);
            submitting.value = false;
            showChangePasswordScreen.value = false;
          })
          .catch((error) => {
            // closeLoading();
            console.log(error);
            submitting.value = false;
            showChangePasswordScreen.value = false;
          });
        //alertSucess('A senha foi actualizado com sucesso.');
        // emit('close');
      }
    } else {
      alertError('A senha Actual e diferente da Preenchida');
      submitting.value = false;
    }
  }
};

const dataBaseUser = () => {
  return UsersService.getUserByUserName(localStorage.getItem('user'));
};

onMounted(() => {
  // getLocalBaseUser()
  console.log(showChangePasswordScreen.value);
});
</script>
