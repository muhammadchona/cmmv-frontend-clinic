import { Notify } from 'quasar';
import { UserLogin } from 'src/stores/models/userLogin/UserLogin'
import api from 'src/services/api/apiService/apiService';
import { useRepo } from 'pinia-orm';
import { nSQL } from 'nano-sql';

const userLogin = useRepo(UserLogin);


export default {
  logout () {
    return api().get('logout')
      .catch((error) => {
        if (error.response) {
          console.log(JSON.stringify(error.response))
          alert(JSON.stringify(error.response.data))
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  fetchUsers () {
    return api().get('secUser')
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  signup (params: any) {
    return api().post('user/signup', params)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  login (params: any) {
    return api().post('/login', params)
      .catch((error) => {
        if (error.response) {
          Notify.create({
            icon: 'announcement',
            message: 'Utilizador ou a senha inválida',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
          })
        }  else {
          Notify.create({
            icon: 'announcement',
            message: 'Problemas ao conectar-se com o Servidor. ',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
          })
          console.log('Error', error.message)
        }
      })
  },
  updateUser (params:any) {
    return api().put('secUser/' + params.id, params)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  apiPost (userType:string,objectToSend :any) {
    return api().post(`${userType}/`,objectToSend)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  postWeb(userType:string,objectToSend :any) {
    return api()
      .post(`${userType}/`, objectToSend)
      .then((resp) => {
        userLogin.save(resp.data);
      });
  },
  getUser (params:any) {
    return api().get('secUser/' + params.id).then(resp => {
       // this.submitting = false
      console.log(resp)
      })
      .catch((error) => {
        if (error.response) {
          Notify.create({
            icon: 'announcement',
            message: 'Aconteceu um erro inesperado ao grava o utilizador.',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
          })
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
   async apiGetAll () {
    return await api().get('/secUser')
  },
  async getAllUsersByDistrictId (districtId:number) {
    return await api().get('/districtUserLogin/district/' + districtId).then(resp => {
      userLogin.save(resp.data);
  }).catch(error => {
      console.log(error)
  })
  },
  async getAllUsersByClinicId (clinicId:number) {
    await api().get('/userLogin/clinic/' + clinicId).then(resp => {
      userLogin.save(resp.data);
     }).catch(error => {
         console.log(error)
     })
 },
  deleteUser (id:number) {
    return api().delete('user/' + id)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },

  getUserByUserName(username: string) {
    return userLogin.query().where('username', username).first();
  },

  putMobile(params:any) {
    return nSQL(UserLogin.entity)
      .query('upsert', params)
      .exec()
      .then(() => {
        userLogin.save(params);
      })
      .catch((error: any) => {
        console.log(error);
      });
  },
  getMobile() {
    return nSQL(UserLogin.entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        userLogin.save(rows);
        return rows;
      })
      .catch((error: any) => {
        console.log(error);
      });
  },

  getAllUsers() {
    return userLogin.all();
  },

}
