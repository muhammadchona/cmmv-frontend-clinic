<template>
  <q-page padding>
    <p>Consulta Marcada</p>
    <div class="q-pa-md">
      <q-card class="my-card" style="max-width: 700px">
        <q-card-section>
          <div class="row">
            <div class="column justify-center">
              <p>Detalhes da Marcacao</p>
              <p>Confirmação Pendente na US</p>
              <br />
            </div>
            <div class="column absolute-right">
              <q-btn rounded color="red" label="Re-marcar" />
            </div>
          </div>
          <div>
            <div class="row justify-left" caption bold>
              <q-icon name="person"   size="2em"/>
              <p>Ordem:</p>
              {{ appointment.orderNumber }}
              <hr/>
              <q-icon name="event" size="2em"/>
              {{appointment.date}}
            </div>
            <div class="row justify-right" caption>
              <q-icon name="schedule" size="2em"/>{{ appointment.time }}
              <hr />
              <q-icon name="place" size="2em"/>{{appointment.clinic}}
            </div>

          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import pageHeader from 'components/Utente/UtenteRegistrationHeader.vue'
import buttone from 'components/Shared/Button.vue'
import { ref , inject } from 'vue'

const utente = inject('utente')
const appointment = ref({
     date: '20/11/2021',
                time: '12:00 AM',
                clinic: 'CS Boane',
                orderNumber: '3'
})
</script>
