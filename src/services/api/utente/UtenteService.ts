import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import Utente from 'src/stores/models/utente/Utente';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const utente = useRepo(Utente);

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
  async postWeb(params: string) {
    return await api()
      .post('utente', params)
      .then((resp) => {
        utente.save(resp.data);
        return resp
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('utente?offset=' + offset + '&max=100')
        .then((resp) => {
          utente.save(resp.data);
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
      .patch('utente/' + id, params)
      .then((resp) => {
        utente
      .save(resp.data);
      return resp
      });
  },
  deleteWeb(id: number) {
    return api()
      .delete('utente/' + id)
      .then(() => {
        utente.destroy(id);
      });
  },

  async apiFetchByMobilizer(mobilizer:any,offset: number) {
    let utentesApiList = []
    await api().get('/utente/communityMobilizer/' + mobilizer).then(resp => {
           offset = offset + 100
           utentesApiList = resp.data
           utentesApiList.forEach(utente => {
                  // utente.communityMobilizer = mobilizer
                  if (utente.syncStatus === undefined || utente.syncStatus === null) {
                      utente.syncStatus = 'S'
                  }
                this.putMobile(utente)
               })
       //     $q.loading.hide()
      }).catch(error => {
      //   $q.loading.hide()
          console.log(error)
      }) 
  },
  // Mobile
  putMobile(params: string) {
    return nSQL(Utente
    .entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        console.log(resp[0].affectedRows)
        utente.save(resp[0].affectedRows);
      });
  },
  getMobile() {
    return nSQL(Utente
    .entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        utente.save(rows);
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(Utente
    .entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        utente
      .destroy(paramsId);
       
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },

  async getMobileUtenteToSend() {
    return await nSQL(Utente
    .entity)
      .query('select')
      .where([['syncStatus','=','P'],'OR',['syncStatus','=','U']])
      .exec()
      .then((rows: any) => {
      //  utente.save(rows);
      console.log(rows)
      return rows;
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },


  // Local Storage Pinia
  newInstanceEntity() {
    return utente.getModel().$newInstance();
  },
  getAllFromStorage() {
    return utente.all();
  },
  deleteAllFromStorage() {
    utente.flush();
  },

  getLocalUtenteById(id:number) {
    return utente.query().whereId(id).first();
  },
  getLocalPendingUtentes() {
      return utente.query()
                   .with('clinic.province')
                   .with('clinic.district.province')
                   .with('communityMobilizer')
                   .with('appointments.clinic.province')
                   .with('appointments.clinic.district.province')
                   .with('addresses.district')
                   .where('status', 'PENDENTE')
                   .orderBy('firstNames')
                   .get()
  },
  getLocalUtentesAssociados() {
    return utente.query()
    .with('clinic', (query) => {
      query.with('district', (query) => {
        query.with('province');
      });
    })
    .with('communityMobilizer')
    .with('appointments')
    .with('addresses', (query) => {
      query.with('district', (query) => {
        query.with('province');
      });
    })
    .where('status', 'ASSOCIADO')
    .orderBy('firstNames')
    .get()
},
getLocalUtentesEnviados() {
  return utente.query()
  .with('clinic', (query) => {
    query.with('district', (query) => {
      query.with('province');
    });
  })
  .with('communityMobilizer')
  .with('appointments',(query) => {
    query.with('clinic', (query) => {
      query.with('district' , (query) => {
        query.with('province');
      });
    });
  })
  .with('addresses', (query) => {
    query.with('district', (query) => {
      query.with('province');
    });
  })
  .where('status', 'ENVIADO')
  .orderBy('firstNames')
  .get()
},
update(utente :any) {
  utente.save(utente);
}
};
