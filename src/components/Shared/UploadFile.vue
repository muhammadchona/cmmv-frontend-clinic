<template>
 <q-form @submit="onSubmit" class="q-gutter-md">
  <div class="q-pa-md">
    <q-file
          v-model="file"
            name="poster_file"
          label="Carregar Ficheiro"
          square
          flat
          outlined
          use-chips
          clearable
          accept=".csv,.txt,.xls,.xlsx,.doc,.docx,.pdf,.dbf,.zip,.rar,.7z,.jpg,.png,.gif"
          max-file-size="5120000"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
  </div>
          <div>
        <q-btn label="Carregar" type="submit" color="primary"  :loading="submitting"/>
      </div>
       <viewDocs :showDownload=false />
       </q-form>
</template>
<script setup>
import { ref } from 'vue'
import InfoDocsOrImages from '../../stores/models/dorcOrImages/InfoDocsOrImages'
import { QSpinnerIos } from 'quasar'
import { useLoading } from 'src/composables/shared/loading/loading';
import viewDocs from 'components/Home/MaterialEducativo.vue'
const file = ref(null)
const submitting = ref(false);
const { closeLoading, showloading } = useLoading();


const onSubmit = () => {
    if (file.value !== null) {
               showloading()
               submitting.value = true
            // doc.title =this.file.name
         //   doc.createdDate = this.file.lastModifiedDate
         //   doc.publishedDate = this.file.lastModifiedDate
       //  console.log(this.formData)
        const formData = new FormData()
        formData.append('title', file.value.name)
    //    formData.append('createdDate', doc.createdDate)
    //    formData.append('publishedDate', doc.publishedDate)
        formData.append('forMobilizer', true)
        formData.append('blop', file.value)
                 InfoDocsOrImages.api().post('/infoDocsOrImages', formData).then(resp => {
              //  offset = offset + 100
                console.log(resp.response.data)
                    submitting.value = false
                $q.notify({
              message: 'Documento carregado com sucesso.',
              color: 'teal'
          })
          file.value = null
         closeLoading()
            }).catch(error => {
              closeLoading()
                console.log(error)
            })
            } else {
              $q.notify({
              message: 'Escolha o Documento e depois Submeta',
              color: 'red'
          })
            }
}
</script>

