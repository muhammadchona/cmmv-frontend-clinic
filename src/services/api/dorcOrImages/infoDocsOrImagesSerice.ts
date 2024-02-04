import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import InfoDocsOrImages from 'src/stores/models/dorcOrImages/InfoDocsOrImages';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const infoDocsOrImages = useRepo(InfoDocsOrImages);

const { alertSucess, alertError } = useSwal();
const { isMobile, isOnline } = useSystemUtils();



export default {
    post(params: string) {
      if (isMobile.value && !isOnline.value) {
        return this.putMobile(params);
      } else {
        return this.postWeb(params);
      }
    },
    get(offset: number) {
      if (isMobile.value && !isOnline.value) {
        this.getMobile();
      } else {
        return this.getWeb(offset);
      }
    },
    patch(id: number, params: string) {
      if (isMobile.value && !isOnline.value) {
        return this.putMobile(params);
      } else {
        return this.patchWeb(id, params);
      }
    },
    delete(id: number) {
      if (isMobile.value && !isOnline.value) {
        this.deleteMobile(id);
      } else {
        return this.deleteWeb(id);
      }
    },
    // WEB
    postWeb(params: string) {
      return api()
        .post('infoDocsOrImages', params)
        .then((resp) => {
            infoDocsOrImages.save(resp.data);
        });
    },
    getWeb(offset: number) {
      if (offset >= 0) {
        return api()
          .get('infoDocsOrImages?offset=' + offset + '&max=100')
          .then((resp) => {
            infoDocsOrImages.save(resp.data);
            offset = offset + 100;
            if (resp.data.length > 0) {
              this.get(offset);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    patchWeb(id: number, params: string) {
      return api()
        .patch('infoDocsOrImages/' + id, params)
        .then((resp) => {
            infoDocsOrImages
        .save(resp.data);
        });
    },
    deleteWeb(id: number) {
      return api()
        .delete('infoDocsOrImages/' + id)
        .then(() => {
            infoDocsOrImages.destroy(id);
        });
    },

    async apiFetchById(id: number) {
      return await api()
        .get(`/infoDocsOrImages/${id}`)
        .then((resp) => {
          infoDocsOrImages.save(resp.data);
          return resp;
        });
    },
    // Mobile
    putMobile(params: string) {
      return nSQL(InfoDocsOrImages
      .entity)
        .query('upsert', params)
        .exec()
        .then((resp) => {
            infoDocsOrImages.save(resp[0].affectedRows);
        });
    },
    getMobile() {
      return nSQL(InfoDocsOrImages
      .entity)
        .query('select')
        .exec()
        .then((rows: any) => {
            infoDocsOrImages.save(rows);
        })
        .catch((error: any) => {
          // alertError('Aconteceu um erro inesperado nesta operação.');
          console.log(error);
        });
    },
    deleteMobile(paramsId: string) {
      return nSQL(InfoDocsOrImages
      .entity)
        .query('delete')
        .where(['id', '=', paramsId])
        .exec()
        .then(() => {
            infoDocsOrImages
        .destroy(paramsId);
          alertSucess('O Registo foi removido com sucesso');
        })
        .catch((error: any) => {
          // alertError('Aconteceu um erro inesperado nesta operação.');
          console.log(error);
        });
    },
    // Local Storage Pinia
    newInstanceEntity() {
      return infoDocsOrImages.getModel().$newInstance();
    },
    getAllFromStorage() {
      return infoDocsOrImages.all();
    },
    deleteAllFromStorage() {
        infoDocsOrImages.flush();
    },

    getAllForMobilizer () {
        return infoDocsOrImages.query().where('forMobilizer', true).get()
    }
  };
