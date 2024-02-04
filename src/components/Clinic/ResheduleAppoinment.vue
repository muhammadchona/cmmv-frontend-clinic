<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-pt-lg">
    <form @submit.prevent="submitAppointment">
      <q-card-section class="q-px-md">
        <div class="row">
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.systemNumber"
            label="Código"
            dense
            class="col"
          />
        </div>
        <div class="row q-pt-md">
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.firstNames"
            label="Nome"
            dense
            class="col"
          />
          <q-input
            outlined
            disable
            v-model="editedAppointment.utente.lastNames"
            label="Apelido"
            dense
            class="col q-ml-md"
          />
        </div>
        <div class="row q-pt-md">
          <q-input
            dense
            outlined
            v-model="editedAppointment.appointmentDate"
            class="col"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    mask="DD-MM-YYYY"
                    v-model="editedAppointment.appointmentDate"
                    :options="blockDataPassado"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-mb-md">
        <q-btn
          type="submit"
          rounded
          label="Cancelar"
          color="primary"
          @click="$emit('close')"
        />
        <q-btn
          type="submit"
          rounded
          label="Submeter"
          color="primary"
          @click.stop="promptToConfirm(appointment)"
        />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script setup>
import { date } from 'quasar';
import { onBeforeMount, ref  } from 'vue';
import moment from 'moment';
import { useQuasar } from 'quasar'
import appointmentService from 'src/services/api/appointment/appointmentService';


const props = defineProps(['appointment']);
const editedAppointment = ref({});
const $q = useQuasar()
//const date = ref(moment(date).format('YYYY-MM-DD'));

const blockDataPassado = (date) => {
  return date >= moment(new Date()).format('YYYY/MM/DD');
};

const formatDateShort = (value) => {
  return date.formatDate(value, 'DD-MM-YYYY');
};

const promptToConfirm = (appointmentToConfirm) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Deseja Confirmar?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    appointmentToConfirm.appointmentDate = moment(
      editedAppointment.value.appointmentDate,
      'DD-MM-YYYY'
    ).toDate();
    appointmentToConfirm.time = editedAppointment.value.time;
    appointmentToConfirm.status = 'CONFIRMADO';
    console.log(appointmentToConfirm);
    const appointmentLocalBase = JSON.parse(
      JSON.stringify(appointmentToConfirm)
    );
    appointmentService.patch(appointmentLocalBase.id,appointmentLocalBase);

  });
};

onBeforeMount(() => {
  editedAppointment.value = Object.assign({}, props.appointment);
  editedAppointment.value.appointmentDate = moment(
    props.appointment.appointmentDate
  ).format('DD-MM-YYYY');
});
</script>

<style></style>
