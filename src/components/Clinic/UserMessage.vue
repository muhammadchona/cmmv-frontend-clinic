<template>
  <div class="row q-mt-xl text-bold">
    Bem Vindo <span class="text-primary q-mx-sm"> {{ username }}</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const username = ref({});

const getUserName = () => {
  username.value = localStorage.getItem('username');
};

onMounted(() => {
  getUserName();
});
</script>

<style></style>
