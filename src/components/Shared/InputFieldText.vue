 <template>
  <q-input
    dense
    rounded
    ref="ref"
    outlined
    :value="description"
    @input="(event) => $emit('update:description', event.target.value)"
    :rules="[val => !!val || 'O Campo é obrigatório']" />
</template>
<script>
export default {
    props: ['description', '']
}
</script>
