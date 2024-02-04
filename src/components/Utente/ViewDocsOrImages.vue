<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="my-card" style="max-width: 700px">
      <q-list bordered separator>
      <q-item clickable v-ripple  v-for="doc in docsOrImages" :key="doc">
        <q-item-section  > {{doc.name}}</q-item-section>
        <q-item-section avatar  >
       <q-icon name="file_download" color="red" />
        </q-item-section>
      </q-item>
       </q-list>
      </q-card>
  </div>
  </q-page>
</template>
<script setup>
import { inject,ref } from 'vue'

const docsOrImages = ref([
        {
          id: 1,
          name: 'Folheto de Convite',
        },
        {
          id: 2,
          name: 'Folheto Para Criancas',
        },
        {
          id: 2,
          name: 'Seriado Activista',
        }
      ])
</script>