import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import CommunityMobilizer from 'src/stores/models/mobilizer/CommunityMobilizer';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const communityMobilizer = useRepo(CommunityMobilizer);

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
      .post('communityMobilizer', params)
      .then((resp) => {
        communityMobilizer.save(resp.data);
        return resp;
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('communityMobilizer?offset=' + offset + '&max=100')
        .then((resp) => {
          communityMobilizer.save(resp.data);
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
      .patch('communityMobilizer/' + id, params)
      .then((resp) => {
        communityMobilizer.save(resp.data);
        return resp;
      });
  },
  deleteWeb(id: number) {
    return api()
      .delete('communityMobilizer/' + id)
      .then(() => {
        communityMobilizer.destroy(id);
      });
  },
  async apiFetchById(id: number) {
    return await api()
      .get(`/communityMobilizer/${id}`)
      .then((resp) => {
        communityMobilizer.save(resp.data);
        this.putMobile(resp.data);
        return resp;
      });
  },
  async apiFetchByDistrictId(districtId: number) {
    return await api()
      .get('/communityMobilizer/district/' + districtId)
      .then((resp) => {
        communityMobilizer.save(resp.data);
      });
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(CommunityMobilizer.entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        communityMobilizer.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(CommunityMobilizer.entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        communityMobilizer.save(rows);
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(CommunityMobilizer.entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        communityMobilizer.destroy(paramsId);
        alertSucess('O Registo foi removido com sucesso');
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return communityMobilizer.getModel().$newInstance();
  },
  getAllFromStorage() {
    return communityMobilizer.all();
  },
  deleteAllFromStorage() {
    communityMobilizer.flush();
  },
  getMobilizerById(id: number) {
    console.log(
      communityMobilizer.query().with('utentes').where('id', id).first()
    );
    return communityMobilizer.query().with('utentes').where('id', id).first();
  },
  update(mobilizer: any) {
    communityMobilizer.save(mobilizer);
  },
  getMobilizerByDistrictId(districtId: number) {
    return communityMobilizer
      .query()
      .where('district_id', districtId)
      .get();
  },
};
