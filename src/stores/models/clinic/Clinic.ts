import { Model } from 'pinia-orm'
import Utente from '../utente/Utente'
import District from '../district/District'


export default class Clinic extends Model {
  static entity = 'clinics'
  static primaryKey ='id'
  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      name: this.attr(''),
      type: this.attr(''),
      latitude: this.attr(''),
      longitude: this.attr(''),
      active: this.attr(''),
      district_id: this.attr(''),

      // Relationshiops
      district: this.belongsTo(District, 'district_id'),
      utentes: this.hasMany(Utente, 'clinic_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
