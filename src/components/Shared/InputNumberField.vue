 <template>
  <q-input
    dense
    type="number"
    rounded outlined
    ref="ref"
    :value="numbers"
    @input="(event) => $emit('update:numbers', event.target.value)">
    <template v-slot:append>
        <q-icon
        name="autorenew"
        class="cursor-pointer"/>
    </template>
  </q-input>
 </template>
 <script>
export default {
    props: ['numbers']
}
</script>
