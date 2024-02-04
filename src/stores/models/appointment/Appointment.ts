import { Model } from 'pinia-orm'
import Clinic from '../clinic/Clinic'
import Utente from '../utente/Utente'
// import db from 'src/store/localbase'

export default class Appointment extends Model {
  static entity = 'appointments'
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.attr(null),
      appointmentDate: this.attr(''),
      time: this.attr(''),
      hasHappened: this.attr(false),
      orderNumber: this.attr(''),
      status: this.attr('PENDENTE'),
      visitDate: this.attr(''),
      utente_id: this.attr(''),
      clinic_id: this.attr(''),
      syncStatus: this.attr(''),

      // Relationships
      utente: this.belongsTo(Utente, 'utente_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
