import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import Address from 'src/stores/models/address/Address';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const address = useRepo(Address);

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
      .post('address', params)
      .then((resp) => {
        address.save(resp.data);
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('address?offset=' + offset + '&max=100')
        .then((resp) => {
          address.save(resp.data);
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
      .patch('address/' + id, params)
      .then((resp) => {
        address
      .save(resp.data);
      });
  },
  deleteWeb(id: number) {
    return api()
      .delete('address/' + id)
      .then(() => {
        address.destroy(id);
      });
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(Address
    .entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        address.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(Address
    .entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        address.save(rows);
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(Address
    .entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        address
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
    return address.getModel().$newInstance();
  },
  getAllFromStorage() {
    return address.all();
  },
  deleteAllFromStorage() {
    address.flush();
  },
};
