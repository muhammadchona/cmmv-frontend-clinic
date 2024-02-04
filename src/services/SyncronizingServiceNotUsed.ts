// import UsersService from '../services/UsersService'
import Utente from 'src/stores/models/utente/Utente'
import utenteService from './api/utente/UtenteService'
// import db from 'src/store/localbase'
import CommunityMobilizer from 'src/stores/models/mobilizer/CommunityMobilizer'
import communityMobilizerService from './api/mobilizer/CommunityMobilizerService'
import Appointment from 'src/stores/models/appointment/Appointment'
import Address from 'src/stores/models/address/Address'
import { UserLogin } from 'src/stores/models/userLogin/UserLoginHierarchy'
import { Notify } from 'quasar'
export default {
  sendUtentes() {
    this.doSend(0);
  },
  downloadUtentes() {
    Utente.localDbGetAll().then((utentes) => {
      if (utentes === 0) {
        console.log('Zero');
      }
    });
  },
  doSend(i) {
    db.newDb()
      .collection('utentes')
      .get({ keys: true })
      .then((utentes) => {
        const utentesToSend = [];
        utentes.forEach((utente) => {
          if (utente.data.syncStatus === 'P') {
            utentesToSend.push(utente.data);
          } else if (utente.data.syncStatus === 'U') {
            utente.data.idServer = utente.key.toString();
            utentesToSend.push(utente.data);
          }
        });
        return utentesToSend;
      })
      .then((utentesToSend) => {
        if (utentesToSend.length > 0) {
          if (utentesToSend[i] !== undefined) {
            console.log(utentesToSend[i]);
            const idToDelete = utentesToSend[i].id.toString();
            const addressIdToDelete =
              utentesToSend[i].addresses[0].id.toString();
            const utenteToSend = Object.assign({}, utentesToSend[i]);
            utenteToSend.id = null;
            utenteToSend.syncStatus = 'S';
            if (utentesToSend[i].syncStatus === 'P') {
              localStorage.setItem('isProcessing', 'true');
              this.processUtentesSyncStatusP(
                utenteToSend,
                utentesToSend,
                i,
                idToDelete,
                addressIdToDelete
              );
            } else if (utentesToSend[i].syncStatus === 'U') {
              localStorage.setItem('isProcessing', 'true');
              this.processUtentesSyncStatusU(utentesToSend, i, utenteToSend);
            }
          } else {
            localStorage.setItem('isProcessing', 'false');
            console.log('Erro ao sincronizar o Utente: ' + utentesToSend[i]);
          }
        } else {
          localStorage.setItem('isProcessing', 'false');
          Notify.create({
            icon: 'announcement',
            message: 'Sincronização de dados Terminada',
            type: 'positive',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'positive',
            textColor: 'white',
            classes: 'glossy',
          });
        }
      });
  },
  getUtentesToSend() {
    const utentesToSend = [];
    db.newDb()
      .collection('utentes')
      .get()
      .then((utentes) => {
        utentes.forEach((utente) => {
          //  let utente = utentes[i]
          if (utente.syncStatus === 'P') {
            utentesToSend.push(utente);
          }
          return utentesToSend;
        });
      });
  },
  processUtentesSyncStatusP(
    utenteToSend,
    utentesToSend,
    i,
    idToDelete,
    addressIdToDelete
  ) {
    console.log(utenteToSend);
    Utente.apiSave(utenteToSend)
      .then((resp) => {
        utentesToSend[i].syncStatus = 'S';
        const idServer = resp.response.data.id.toString();
        utentesToSend[i].id = resp.response.data.id;
        utentesToSend[i].$id = resp.response.data.id;
        Utente.update({
          data: utentesToSend[i],
        });
        if (resp.response.data.addresses !== undefined) {
          utentesToSend[i].addresses[0].id = resp.response.data.addresses[0].id;
        }
        db.newDb().collection('utentes').doc({ id: idToDelete }).delete();
        db.newDb().collection('utentes').doc(idServer).set(utentesToSend[i]);
        Address.delete(addressIdToDelete);
        Utente.delete(idToDelete);
        if (resp.response.data.appointments !== undefined) {
          Appointment.delete(resp.response.data.appointments[0].id);
        }
        //   db.newDb().collection('utentes').doc({ id: utente.id }).set(utente)
        i = i + 1;
        setTimeout(this.doSend(i), 2);
      })
      .catch((error) => {
        localStorage.setItem('isProcessing', 'false');
        console.log(error);
      });
  },
  processUtentesSyncStatusU(utentesToSend, i, utenteToSend) {
    db.newDb()
      .collection('utentes')
      .doc(utentesToSend[i].idServer)
      .get()
      .then((utente) => {
        utenteToSend.id = utentesToSend[i].idServer;
        utentesToSend[i].$id = utentesToSend[i].idServer;
        utentesToSend[i].id = utentesToSend[i].idServer;
        Utente.apiUpdate(utenteToSend).then((resp) => {
          utentesToSend[i].syncStatus = 'S';
          const idServer = resp.response.data.id.toString();
          db.newDb().collection('utentes').doc(idServer).set(utentesToSend[i]);
          Utente.update({
            data: utentesToSend[i],
          });
          //      Utente.delete(resp.response.data.id)
          i = i + 1;
          setTimeout(this.doSend(i), 2);
        });
      });
  },
  async sendMobilizerData() {
    await db
      .newDb()
      .collection('mobilizer')
      .get()
      .then((mobilizers) => {
        mobilizers.forEach((mobilizer) => {
          CommunityMobilizer.api()
            .patch('/communityMobilizer/' + mobilizer.id, mobilizer)
            .then((resp) => {
              CommunityMobilizer.update(mobilizer);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
  },
  sendUserDataPassUpdated() {
    db.newDb()
      .collection('users')
      .get()
      .then((mobilizers) => {
        const user = mobilizers[0];
        UserLogin.api()
          .patch('/secUser/' + user.idUser, user)
          .catch((error) => {
            console.log(error);
          });
      });
  },
  sendAppointmentsClinicData() {
    db.newDb()
      .collection('appointments')
      .get()
      .then((appointments) => {
        console.log(appointments);
        const appointmentsToSend = [];
        appointments.forEach((appointment) => {
          if (
            (appointment.status === 'CONFIRMADO' &&
              appointment.syncStatus !== 'S') ||
            (appointment.hasHappened && appointment.syncStatus !== 'S')
          ) {
            appointmentsToSend.push(appointment);
          }
        });
        return appointmentsToSend;
      })
      .then((appointmentsToSend) => {
        const i = 0;
        console.log(appointmentsToSend);
        // const appointment[i] =
        this.sendAppointment(appointmentsToSend, i);
      });
  },
  getAppointmentsClinicData() {
    const clinicId = Number(localStorage.getItem('id_clinicUser'));
    Appointment.api()
      .get('/appointment/clinic/' + clinicId)
      .then((resp) => {
        let appointmentsList = [];
        appointmentsList = resp.response.data;
        appointmentsList.forEach((appointment) => {
          db.newDb()
            .collection('appointments')
            .doc({ id: appointment.id })
            .get()
            .then((appointmentObj) => {
              if (appointmentObj === undefined) {
                appointment.syncStatus = 'S';
                Appointment.localDbAdd(appointment);
              } else if (
                appointmentObj !== undefined &&
                (appointment.hasHappened !== appointmentObj.hasHappened ||
                  appointmentObj.status !== appointment.status ||
                  appointmentObj.appointmentDate !==
                    appointment.appointmentDate)
              ) {
                appointment.synStatus = 'S';
                db.newDb()
                  .collection('appointments')
                  .doc({ id: appointment.id })
                  .set(appointment);
              }
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  sendAppointment(appointmentsToSend, i) {
    if (appointmentsToSend[i] !== undefined) {
      Appointment.api()
        .patch(
          '/appointment/' + appointmentsToSend[i].id,
          appointmentsToSend[i]
        )
        .then((resp) => {
          console.log(resp.response.data);
          appointmentsToSend[i].syncStatus = 'S';
          db.newDb()
            .collection('appointments')
            .doc({ id: appointmentsToSend[i].id })
            .set(appointmentsToSend[i]);
          i = i + 1;
          setTimeout(this.sendAppointment(appointmentsToSend, i), 2);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      Notify.create({
        icon: 'announcement',
        message: 'Sincronização de dados Terminada',
        type: 'positive',
        progress: true,
        timeout: 3000,
        position: 'top',
        color: 'positive',
        textColor: 'white',
        classes: 'glossy',
      });
    }
  },
};
