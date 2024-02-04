<template>
  <q-item clickable v-ripple>
    <q-item-section avatar top>
      <q-icon name="date_range" size="lg" color="grey-8" />
    </q-item-section>

    <q-item-section>
      <q-item-label
        >&nbsp;{{
          appointment && formatDateShort(appointment.appointmentDate)
        }}
        &nbsp;
      </q-item-label>
      <q-item-label caption
        ><span
          >Utente: {{ appointment.utente && appointment.utente.firstNames }}
          {{ appointment.utente && appointment.utente.lastNames }}
          <span>
            &nbsp; &nbsp;Codigo&nbsp;:{{
              appointment.utente && appointment.utente.systemNumber
            }}
          </span>
        </span></q-item-label
      >
    </q-item-section>

    <q-item-section side>
      <q-btn v-if="!appointment.hasHappened"
        color="red"
        flat
        icon="delete"
        @click.stop="promptToConfirm(appointment)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date } from 'quasar';
import { useQuasar } from 'quasar'
import appointmentService from 'src/services/api/appointment/appointmentService';


const props = defineProps(['appointment']);
const $q = useQuasar()



const formatDateShort = (value) => {
  return date.formatDate(value, 'DD-MM-YYYY');
};

const promptToConfirm = (appointmentToConfirm) => {
  if (appointmentToConfirm.syncStatus === 'S') {
    $q.dialog({
      title: 'Informação',
      message:
        'Não Pode Editar a consulta uma vez que esta já foi sincronizada',
      ok: {
        label: 'OK',
        push: true,
        color: 'blue',
      },
      persistent: true,
    }).onOk(() => {
      //   finalize(reset)
    });
  } else {
    $q
      .dialog({
        title: 'Confirmação',
        message: 'Deseja remover a confirmação?',
        cancel: true,
        persistent: true,
      })
      .onOk(() => {
        appointmentToConfirm.status = 'PENDENTE';
        const appointmentLocalBase = JSON.parse(
          JSON.stringify(appointmentToConfirm)
        );
        appointmentService.patch(appointmentLocalBase.id,appointmentLocalBase);
      });
  }
};
</script>

<style></style>
