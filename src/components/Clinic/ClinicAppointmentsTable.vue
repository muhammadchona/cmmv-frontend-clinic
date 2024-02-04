<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :filter="filter"
    virtual-scroll
    row-key="name">
    <template v-slot:top-right>
      <q-input outlined dense debounce="300" v-model="filter" placeholder="Pesquisa">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <div class="q-pa-md q-gutter-sm">
        <q-btn color="primary" icon="download_for_offline" no-caps @click="exportTable" />
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-if="props.row.hasHappened" key="visitDate" :props="props">
         {{ getDDMMYYYFromJSDate(props.row.visitDate) }}
        </q-td>
        <q-td v-else key="appointmentDate" :props="props">
          {{ getDDMMYYYFromJSDate(props.row.appointmentDate) }}
        </q-td>
        <q-td key="systemNumber" :props="props">
          {{ props.row.utente.systemNumber }}
        </q-td>
        <q-td key="nameUser" :props="props">
          {{ props.row.utente.firstNames }} {{ props.row.utente.lastNames }}
        </q-td>
        <q-td key="hasHappened" :props="props">
          <q-checkbox v-model="props.row.hasHappened"
                      color="primary"
                      v-if="(moment(new Date(), 'DD-MM-YYYY') < moment(visitDatePlusTwoDays(props.row.visitDate, 'DD-MM-YYYY')))"
                      @click="getSelectedString(props.row)" />
          <q-checkbox v-model="props.row.hasHappened"
                      color="primary"
                      v-else-if="!props.row.hasHappened"
                      @click="getSelectedString(props.row)" />
          <span v-if="props.row.hasHappened"> Sim
               <q-icon name="info"
                       style="font-size: 1.5em"
                       color="negative"
                       v-if="(new Date(new Date().setHours(0,0,0,0)).getTime() < new Date(visitDatePlusTwoDays(props.row.visitDate).setHours(0,0,0,0)).getTime())">
                  <q-tooltip
                    transition-show="rotate"
                    transition-hide="rotate"
                    anchor="bottom middle"
                    self="center middle"
                  >
                      <strong>Após {{ formatDateDDMMMYYYY(visitDatePlusTwoDays(props.row.visitDate)) }}</strong> não poderá <em>editar esta consulta</em>
                  </q-tooltip>
               </q-icon>
               </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>

</template>
<script setup>
import { ref } from 'vue';
import { date, exportFile } from 'quasar';
import moment from 'moment';
import { useDateUtils } from 'src/composables/shared/dateUtils/dateUtils';
import appointmentService from 'src/services/api/appointment/appointmentService';

const { addToDate } = date;

const props = defineProps(['rows', 'columns', 'updateClinicAppoitment']);

const selected = ref([]);
const lastIndex = ref(null);
const filter = ref('');
const unit = 'days';
const { getDDMMYYYFromJSDate } = useDateUtils();
const diffBlockDays = (visitPlus2, today) => {
  const a = moment(visitPlus2);
  const b = moment(today);
  // return moment.utc(moment(a, 'DD/MM/YYYY HH:mm').diff(moment(b, 'DD/MM/YYYY HH:mm'))).format('HH:mm')
  const diff = a.diff(b, 'days');
  // return formatDateDDMMMYYYY(moment(visitPlus2).subtract(diff, 'days'))
  return date.formatDate(moment(visitPlus2).subtract(diff, 'days'), 'DD-MM-YYYY');
};

const visitDatePlusTwoDays = (visitDate) => {
  const result = addToDate(moment(visitDate).set('hour', '23').set('minute', '59').set('second', '59'), { days: 2 });
  return result;
};

const getSelectedString = (appointment) => {
  const newAppointment = Object.assign({}, appointment);
  newAppointment.id = appointment.id;
  newAppointment.hasHappened = appointment.hasHappened;
  if (!appointment.hasHappened) {
    newAppointment.visitDate = null;
  } else {
    newAppointment.visitDate = new Date();
  }
  appointmentService.patch(newAppointment.id, newAppointment)
};

const formatDateDDMMMYYYY = (value) => {
  return moment(value).format('DD-MM-YYYY');
};

const exportTable = () => {
  // naive encoding to csv format
  const content = [props.columns.map(col => wrapCsvValue(col.label))]
    .concat(
      props.rows.map(row =>
        columns
          .map(col =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === undefined ? col.name : col.field],
              col.format
            )
          )
          .join(',')
      )
    ).join('\r\n');
  const status = exportFile('consultas_list.csv', content, 'text/csv');
  if (status !== true) {
    $q.notify({
      message: 'O navegador recusou o download...',
      color: 'negative',
      icon: 'warning'
    });
  }
};

const wrapCsvValue = (val, formatFn) => {
  let formatted = formatFn !== undefined ? formatFn(val) : val;
  formatted = formatted === undefined || formatted === null ? '' : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
};

</script>
