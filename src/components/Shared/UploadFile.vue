<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="q-pa-md" v-if="website">
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
      <q-btn
        label="Carregar"
        type="submit"
        color="primary"
        :loading="submitting"
      />
    </div>
    <viewDocs :showDownload="false" />
  </q-form>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar, QSpinnerIos } from 'quasar';
import { useLoading } from 'src/composables/shared/loading/loading';
import viewDocs from 'components/Home/MaterialEducativo.vue';
import infoDocsOrImagesSerice from 'src/services/api/dorcOrImages/infoDocsOrImagesSerice';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';
const file = ref(null);
const submitting = ref(false);
const { closeLoading, showloading } = useLoading();
const $q = useQuasar();

const { isMobile, website } = useSystemUtils();

const selectFile = () => {
  let filter = { mime: 'application/pdf' };
  /*
  window.cordova.plugins.filePicker.pickFile((uri) => {
    file.value = uri.split('/').pop();
          // Handle the file uri as needed
          this.file = uri;
        }, (error) => {
          console.error('Error picking file:', error);
        });
        */
  /*
  fileChooser.open(
    function (uri) {
      // Convert content URI to a file system path
      window.resolveLocalFileSystemURL(uri, function(fileEntry) {
    fileEntry.file(function(file) {
        console.log('File name:', file.name);
        console.log('File full path:', fileEntry.fullPath);
        successCallback(fileEntry.fullPath);
    }, function(error) {
        console.error('Error accessing file:', error);
    });
}, function(error) {
    console.error('Error resolving file system URL:', error);
});
    },
    function (error) {
      console.error('Error picking file:', error);
    }
  );
  */

  document.addEventListener(
    'deviceready',
    function () {
      //  var fileChooser = window.cordova.plugins.fileChooser;

      fileChooser.open(
        { mime: 'application/pdf' },
        function (uri) {
          console.log('Picked file URI:', uri);
          var permissions = cordova.plugins.permissions;
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function (status) {
              if (!status.hasPermission) {
                console.error('READ_EXTERNAL_STORAGE permission denied');
              }
            },
            function (error) {
              console.error(
                'Error requesting READ_EXTERNAL_STORAGE permission:',
                error
              );
            }
          );

          window.resolveLocalFileSystemURL(
            uri,
            function (fileEntry) {
              console.log('File entry:', fileEntry);
              fileEntry.file(
                function (file) {
                  console.log('File:', file);

                  var reader = new FileReader();
                  reader.onloadend = function (evt) {
                    var fileBlob = new Blob([evt.target.result], {
                      type: 'application/pdf',
                    });
                    // Handle fileBlob here
                  };
                  reader.readAsArrayBuffer(file);
                },
                function (error) {
                  console.error('Error accessing file:', error);
                }
              );
            },
            function (error) {
              console.error('Error resolving file system URL:', error);
            }
          );
        },
        function (error) {
          console.error('Error picking file:', error);
        }
      );
    },
    false
  );
};

const successCallback = (localFileUri) => {
  // let vm = this;
  // open file using path
  let fileFormat = localFileUri.substr(localFileUri.length - 4);
  // manually rejected if not pdf, because mime filter is not working on some phone
  if (fileFormat !== '.pdf') {
    return false;
  }
  window.resolveLocalFileSystemURL(
    localFileUri,
    function (fs) {
      console.log(fs);
      fs.file(function (res) {
        var reader = new FileReader();
        reader.onloadend = (evt) => {
          var fileBlob = new Blob([evt.target.result], {
            type: 'application/pdf',
          });
          //  vm.sendToServer({ file: fileBlob, name: fs.name });
          infoDocsOrImagesSerice
            .post(formData)
            .then((resp) => {
              //  offset = offset + 100
              //   console.log(resp.response.data)
              submitting.value = false;
              $q.notify({
                message: 'Documento carregado com sucesso.',
                color: 'teal',
              });
              file.value = null;
              closeLoading();
            })
            .catch((error) => {
              closeLoading();
              console.log(error);
            });
        };
        reader.readAsArrayBuffer(res);
      });
    },
    onError()
  );
};

const onSubmit = () => {
  if (file.value !== null) {
    showloading();
    submitting.value = true;
    // doc.title =this.file.name
    //   doc.createdDate = this.file.lastModifiedDate
    //   doc.publishedDate = this.file.lastModifiedDate
    //  console.log(this.formData)
    const formData = new FormData();
    formData.append('title', file.value.name);
    //    formData.append('createdDate', doc.createdDate)
    //    formData.append('publishedDate', doc.publishedDate)
    formData.append('forMobilizer', true);
    formData.append('blop', file.value);
    infoDocsOrImagesSerice
      .post(formData)
      .then((resp) => {
        //  offset = offset + 100
        //   console.log(resp.response.data)
        submitting.value = false;
        $q.notify({
          message: 'Documento carregado com sucesso.',
          color: 'teal',
        });
        file.value = null;
        closeLoading();
      })
      .catch((error) => {
        closeLoading();
        console.log(error);
      });
  } else {
    $q.notify({
      message: 'Escolha o Documento e depois Submeta',
      color: 'red',
    });
  }
};

onMounted(() => {
  console.log('Carregamento');
});
</script>
