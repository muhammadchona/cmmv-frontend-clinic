 <template>
  <q-select dense rounded outlined :value="description" :options="options" ref="ref"/>
 </template>
 <script>
export default {
    props: ['description', 'options']
}
</script>
