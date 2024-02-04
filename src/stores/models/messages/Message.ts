import { Model } from 'pinia-orm'
import Utente from '../utente/Utente'
// import db from 'src/store/localbase'

export default class Message extends Model {
  static entity = 'messages'

  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      messageType: this.attr(''),
      smsDate: this.attr(''),
      utente_id: this.attr(''),

      // Relationships
      utente: this.belongsTo(Utente, 'utente_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
