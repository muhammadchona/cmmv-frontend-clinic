import { Model } from 'pinia-orm';
import Address from '../address/Address'
import Appointment from '../appointment/Appointment'
import Message from '../messages/Message'
import CommunityMobilizer from '../mobilizer/CommunityMobilizer'
import InfoDocsOrImages from '../dorcOrImages/InfoDocsOrImages'
import Clinic from '../clinic/Clinic'

export default class Utente extends Model {
  static entity = 'utentes'
 // static eagerLoad = ['address', 'mobilizer', 'clinic', 'appointments', 'infoDocsImages']

  static fields () {
    return {
      id: this.attr(null),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      birthDate: this.attr(''),
      cellNumber: this.attr(''),
      whatsappNumber: this.attr(''),
      preferedLanguage: this.attr(''),
      documentType: this.attr(''),
      documentNumber: this.attr(''),
      systemNumber: this.attr(''),
      haspartner: this.attr(''),
      status: this.attr(''),
      selected: this.attr(''),
      syncStatus: this.attr(''),
      registerDate: this.attr(''),
      communityMobilizer_id: this.attr(''),
      clinic_id: this.attr(''),

      // Relationships
      addresses: this.hasMany(Address, 'utente_id'),
      communityMobilizer: this.belongsTo(CommunityMobilizer, 'communityMobilizer_id'),
      infoDocsImages: this.hasMany(InfoDocsOrImages, 'infoDocsImages_id'),
      messages: this.hasMany(Message, 'utente_id'),
      appointments: this.hasMany(Appointment, 'utente_id'),
      // user: this.hasOne(UtenteLogin, 'utente_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
