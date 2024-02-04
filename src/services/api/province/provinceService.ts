import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import Province from 'src/stores/models/province/Province';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const province = useRepo(Province);

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
  // WEB
  postWeb(params: string) {
    return api()
      .post('province', params)
      .then((resp) => {
        province.save(resp.data);
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('province?offset=' + offset + '&max=100')
        .then((resp) => {
          province.save(resp.data);
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
      .patch('province/' + id, params)
      .then((resp) => {
        province.save(resp.data);
      });
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(Province.entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        province.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(Province.entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        province.save(rows);
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },

  getAllProvinces() {
    return province
      .query()
      .withAllRecursive(2)
      .orderBy('code', 'asc')
      .get();
  },

  // Local Storage Pinia
  newInstanceEntity() {
    return province.getModel().$newInstance();
  },
  getAllFromStorage() {
    return province.all();
  },
  getProviceById(provinceId: number) {
    return province.query().where('id', provinceId).first();
  },
  deleteAllFromStorage() {
    province.flush();
  },
};
