 <template>
  
      <q-item  rounded clickable v-ripple  v-for="vare on vars" :key="vare" >
        <q-item-section rounded> {{vare}}</q-item-section>
      </q-item>

</template>
<script>
export default {
    props: ['show', 'vars', 'vare']
}
</script>
