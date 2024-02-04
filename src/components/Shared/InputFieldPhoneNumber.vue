 <template>
  <q-input
    dense
    rounded
    outlined
    ref="ref"
    type="tel"
    :value="phoneNumber"
    @input="$emit('update:phoneNumber' ,$event)"
   />
</template>
<script>
export default {
    props: ['phoneNumber']
}
</script>
