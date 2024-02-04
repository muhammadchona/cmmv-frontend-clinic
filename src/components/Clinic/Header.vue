<template>
  <div >
      <q-header class="q-py-sm">
        <q-toolbar>
            <q-tabs v-model="tab" class="absolute-center">
                <q-tab name="dashboard" icon="pie_chart" label="Dashboard" />
                <q-tab name="consulta" icon="date_range" label="Consulta" />
                <q-tab name="reports" icon="show_chart" label="Relatórios" />
            </q-tabs>
            <div class="absolute-right items-center q-mt-sm">
            <span>Admin,</span>
                <q-btn to="/auth" icon-right="account_circle" label="Sair" flat />
                <q-icon name="expand_more" size="sm" class="q-mr-sm" />
            </div>
        </q-toolbar>


      </q-header>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
    data () {
        return {
      tab: ref('dashboard')
    }
    }
}
</script>

<style>

</style>
