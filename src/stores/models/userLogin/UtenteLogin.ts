import Utente from '../utente/Utente'
import { UserLogin } from './UserLoginHierarchy'

export class UtenteLogin extends UserLogin {
  static entity = 'utenteLogins'
  static baseEntity = 'userLogins'

  static fields () {
    return {
        ...super.fields(),
        utente_id: this.attr(null),
        utente: this.belongsTo(Utente, 'utente_id')
    }
  }
}
