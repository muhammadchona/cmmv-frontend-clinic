<template>
  <q-page class="flex flex-center">
    <q-card class="my-card" style="width: 400px; height: auto">
        <img src="../assets/User-Profile.png" ratio="1" width="200px">

        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ lorem }}
        </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'CleanPageFor Test'
}
</script>
