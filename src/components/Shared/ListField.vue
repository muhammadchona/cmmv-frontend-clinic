 <template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered rounded separator v-if="show">
      <q-item  rounded clickable v-ripple  :v-for="(element,elements) in elements" :key="element">
        <q-item-section rounded> {{element}}</q-item-section>
      </q-item>
       </q-list>
  </div>
</template>
<script>
export default {
    props: ['show', 'elements', 'element']
}
</script>
