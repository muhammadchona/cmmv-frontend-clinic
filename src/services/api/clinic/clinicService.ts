import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import Clinic from 'src/stores/models/clinic/Clinic';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const clinic = useRepo(Clinic);

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
  getAllClinicsByDistrictId(districtId: number) {
    if (isMobile.value && !isOnline.value) {
      this.getAllByDistrictIdMobile(districtId);
    } else {
      return this.getgetAllByDistrictIdWeb(districtId);
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
      .post('clinic', params)
      .then((resp) => {
        clinic.save(resp.data);
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('clinic?offset=' + offset + '&max=100')
        .then((resp) => {
          clinic.save(resp.data);
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
  getgetAllByDistrictIdWeb(districtId: number) {
    return api()
      .get('/clinic/district/' + districtId)
      .then((resp) => {
        clinic.save(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  patchWeb(id: number, params: string) {
    return api()
      .patch('clinic/' + id, params)
      .then((resp) => {
        clinic.save(resp.data);
      });
  },
  deleteWeb(id: number) {
    return api()
      .delete('clinic/' + id)
      .then(() => {
        clinic.destroy(id);
      });
  },

  async getAllByDistrictIdMobile(districtId: number) {
    await api()
      .get('/clinic/district/' + districtId)
      .then((resp) => {
        this.putMobile(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(Clinic.entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        clinic.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(Clinic.entity)
      .query('select')
      .exec()
      .then((rows) => {
        clinic.save(rows);
      })
      .catch((error) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(Clinic.entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        clinic.destroy(paramsId);
        alertSucess('O Registo foi removido com sucesso');
      })
      .catch((error) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return clinic.getModel().$newInstance();
  },
  getAllFromStorage() {
    return clinic.all();
  },
  deleteAllFromStorage() {
    clinic.flush();
  },
  getLocalClinicsByDistrictId(districtId: number) {
    return clinic
      .query()
      .where('district_id', districtId)
      .get();
  },

  getByClinicId(id: number) {
    return clinic.query().with('district').whereId(id).first();
  },

  getClinicByUse(id_clinicUser: number) {
    return clinic.query().withAllRecursive().find(id_clinicUser);
  },
  getClinicSByUser(id_clinicUser: number) {
    return clinic.query().where('id',id_clinicUser).get();
  },
};
