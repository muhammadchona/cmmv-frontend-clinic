<template>
   <q-input dense rounded outlined :value="dateBirth" >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer"  :value="dateBirth">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date
            :modelValue="dateBirth"
            :value="dateBirth"
            @input="(event) => $emit('update:dateBirth', $event.target.value)"
            mask="DD-MM-YYYY">
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
</template>
<script>
export default {
    props: ['dateBirth']
}
</script>
