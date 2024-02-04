<template>
  <div>
    <div class="row q-py-lg q-mt-md text-weight-bold text-subtitle1">
      <p>Definições</p>
      <UserMessage :userName="username" />
    </div>
    <div class="">
      <q-toolbar>
        <q-tabs v-model="selectedTab" shrink stretch>
          <div v-if="isAdmin || isUser">
            <q-tab name="Clinicas" label="Unidade Sanitária" />
          </div>
          <q-tab name="Utilizadores" label="Utilizadores" />
<!--          <div v-if="!isAdmin">-->
<!--            <q-tab name="Mobilizadores" label="Mobilizadores" />-->
<!--          </div>-->
          <div v-if="isAdmin">
            <q-tab name="Docs" label="Material Educativo" />
          </div>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="selectedTab" dense no-caps inline-label>
        <q-tab-panel name="Clinicas">
          <addClinic> </addClinic>
        </q-tab-panel>
<!--        <q-tab-panel name="Mobilizadores">-->
<!--          <mobilizers> </mobilizers>-->
<!--        </q-tab-panel>-->
        <q-tab-panel name="Utilizadores">
          <users> </users>
        </q-tab-panel>
        <q-tab-panel name="Docs">
          <upload> </upload>
        </q-tab-panel>
      </q-tab-panels>
      <q-separator class="q-mx-md" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

//components

import addClinic from 'components/Clinic/AddClinic.vue';
import users from 'components/Clinic/Users.vue';
import UserMessage from 'components/Clinic/UserMessage.vue';
import upload from 'components/Shared/UploadFile.vue';

const selectedTab = ref('Clinicas');
const isAdmin = ref(true);
const isUser = ref(false);
const username = ref();

onMounted(() => {
  username.value = localStorage.getItem('username');
  if (localStorage.getItem('role') === 'ROLE_ADMIN') {
  } else if (localStorage.getItem('role') === 'ROLE_USER_DISTRICT') {
    isAdmin.value = false;
    // selectedTab = 'Clinicas'
  } else if (localStorage.getItem('role') === 'ROLE_USER') {
    isAdmin.value = false;
    isUser.value = true;
    selectedTab.value = 'Clinicas';
  }
});
</script>
