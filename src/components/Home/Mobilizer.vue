<template>
    <transition-group
        appear
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut absolute-top"
        >
   <q-card key="mobilizer" class="my-card full-width q-pt-lg" >
        <q-card-section class="text-center">
            <img src="~src/assets/mobilizador.png">
            <div class="text-h6 q-py-xs text-weight-light">{{mobilizer.firstNames + ' ' + mobilizer.lastNames}}</div>
        </q-card-section>


        <q-separator light />

        <div class="text-center q-py-md items-center">
            <q-icon name="call" size="sm" color="green-10" />
            <q-btn flat>{{mobilizer.cellNumber}}</q-btn>
            <q-icon name="call" size="sm" color="green-10" />
            <q-btn flat >{{mobilizer.cellNumber2}}</q-btn>
        </div>
    </q-card>
</transition-group>
</template>

<script setup>

import { inject } from 'vue'

const mobilizer = inject('mobilizer')

</script>

<style>

</style>
