// import UsersService from '../services/UsersService'
import Utente from 'src/stores/models/utente/Utente'
import utenteService from './api/utente/UtenteService'
// import db from 'src/store/localbase'
import communityMobilizerService from './api/mobilizer/CommunityMobilizerService'
import { Notify } from 'quasar'
import appointmentService from './api/appointment/appointmentService'
export default {
        sendUtentes () {
          utenteService.getMobileUtenteToSend().then(utentesToSend => {
            this.doSend(utentesToSend , 0)
          })
        },
        downloadUtentes () {
            Utente.localDbGetAll().then(utentes => {
                if (utentes === 0) {
                        console.log('Zero')
                }
            })
        },
       doSend (utentesToSend:any, i:number) {
        if (utentesToSend[i] !== undefined) {
            console.log(utentesToSend[i])
            const idToDelete = utentesToSend[i].id.toString()
            // const addressIdToDelete = utentesToSend[i].addresses[0].id.toString()
            const utenteToSend = Object.assign({}, utentesToSend[i])
            utenteToSend.id = null
            utenteToSend.syncStatus = 'S'
            if (utentesToSend[i].syncStatus === 'P') {
              localStorage.setItem('isProcessing', 'true')
             this.processUtentesSyncStatusP(utenteToSend, utentesToSend, i, idToDelete, 0)
            } else if (utentesToSend[i].syncStatus === 'U') {
              localStorage.setItem('isProcessing', 'true')
             this.processUtentesSyncStatusU(utentesToSend, i, utenteToSend)
            }
        }  else {
        localStorage.setItem('isProcessing', 'false')
        Notify.create({
          icon: 'announcement',
          message: 'Sincronização de dados Terminada',
          type: 'positive',
          progress: true,
          timeout: 3000,
          position: 'top',
          color: 'positive',
          textColor: 'white',
          classes: 'glossy'
        })
      }

        },
        processUtentesSyncStatusP (utenteToSend : any, utentesToSend :any, i:number, idToDelete, addressIdToDelete) {
            console.log(utenteToSend)
          utenteService.postWeb(utenteToSend).then(resp => {
            utentesToSend[i].syncStatus = 'S'
            const idServer = resp.data.id.toString()
            utentesToSend[i].id = resp.data.id
            utentesToSend[i].$id = resp.data.id
            utenteService.putMobile(utentesToSend[i])
            utenteService.deleteMobile(idToDelete)
            //   db.newDb().collection('utentes').doc({ id: utente.id }).set(utente)
            i = i + 1
            setTimeout(this.doSend(utentesToSend, i), 2)
          }).catch(error => {
            localStorage.setItem('isProcessing', 'false')
            console.log(error)
          })
        },
        processUtentesSyncStatusU (utentesToSend:any, i:number, utenteToSend:any) {
          utenteService.patchWeb(utentesToSend[i].id,utentesToSend[i]).then(resp => {
            utenteToSend.id = utentesToSend[i].id
            utentesToSend[i].$id = utentesToSend[i].id
            utentesToSend[i].id = utentesToSend[i].id
              utentesToSend[i].syncStatus = 'S'
              if (resp.data.appointments.length > 0)  utentesToSend[i].appointments[0].id = resp.data.appointments[0].id
             // const idServer = resp.data.id.toString()
              utenteService.putMobile(utentesToSend[i])
              //      Utente.delete(resp.response.data.id)
              i = i + 1
              setTimeout(this.doSend(utentesToSend, i), 2)
          })
        },
       async sendMobilizerData () {
        await communityMobilizerService.getMobile().then(mobilizers => {
            mobilizers.forEach(mobilizer => {
                communityMobilizerService.patchWeb(mobilizer.id, mobilizer)
            })
        })
        },
        sendUserDataPassUpdated () {
          /*
            db.newDb().collection('users').get().then(mobilizers => {
                const user = mobilizers[0]
                UserLogin.api().patch('/secUser/' + user.idUser, user).catch(error => {
                console.log(error)
            })
            })
            */
         },
         sendAppointmentsClinicData () {
          appointmentService.getAppointmentToSendFromMobile().then(appointmentsToSend => {
              const i = 0
                  console.log(appointmentsToSend)
                      // const appointment[i] =
                      this.sendAppointment(appointmentsToSend, i)
                })
        },
        getAppointmentsClinicData () {
         const clinicId = Number(localStorage.getItem('id_clinicUser'))
         appointmentService.apiGetAppointmentsByClinicId(clinicId).then(resp => {
         let appointmentsList = []
         appointmentsList = resp.data
         appointmentsList.forEach(appointment => {
           appointmentService.getFromMobileById(appointment.id).then(appointmentObj => {
                if (appointmentObj === undefined) {
                    appointment.syncStatus = 'S'
                    appointmentService.putMobile(appointment)
                } else if (appointmentObj !== undefined && (appointment.hasHappened !== appointmentObj.hasHappened || appointmentObj.status !== appointment.status || appointmentObj.appointmentDate !== appointment.appointmentDate)) {
                    appointment.synStatus = 'S'
                    appointmentService.putMobile(appointment)
                }
              })
         })
        }).catch(error => {
            console.log(error)
    })
        },
        sendAppointment (appointmentsToSend, i) {
            if (appointmentsToSend[i] !== undefined) {
              appointmentService.patchWeb('/appointment/' + appointmentsToSend[i].id, appointmentsToSend[i]).then(resp => {
                console.log(resp.data)
                appointmentsToSend[i].syncStatus = 'S'
                appointmentService.putMobile(appointmentsToSend[i])
                i = i + 1
                setTimeout(this.sendAppointment(appointmentsToSend, i), 2)
            }).catch(error => {
                console.log(error)
        })
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
                classes: 'glossy'
              })
        }
    }
   }
