import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import District from 'src/stores/models/district/District';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const district = useRepo(District);

const { alertSucess } = useSwal();
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
      this.deleteMobile(String(id));
    } else {
      return this.deleteWeb(id);
    }
  },
  // WEB
  postWeb(params: string) {
    return api()
      .post('district', params)
      .then((resp) => {
        district.save(resp.data);
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('district?offset=' + offset + '&max=100')
        .then((resp) => {
          district.save(resp.data);
          this.putMobile(resp.data)
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
      .patch('district/' + id, params)
      .then((resp) => {
        district.save(resp.data);
      });
  },
  deleteWeb(id: number) {
    return api()
      .delete('district/' + id)
      .then(() => {
        district.destroy(id);
      });
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(District.entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        district.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(District.entity)
      .query('select')
      .exec()
      .then((rows) => {
        district.save(rows);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(District.entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        district.destroy(paramsId);
        alertSucess('O Registo foi removido com sucesso');
      })
      .catch((error: any) => {
        console.log(error);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return district.getModel().$newInstance();
  },
  getAllFromStorage() {
    return district.all();
  },
  deleteAllFromStorage() {
    district.flush();
  },

  getAllByProvinceId(provinceId: number) {
    return district.query().withAll().where('province_id', provinceId).get();
  },
  getById(districtId: number) {
    return district.query().withAll().whereId(districtId).first();
  },
  getDistrictByIdLogin(idLogin: number) {
    return district.query().find(idLogin);
  },
};
