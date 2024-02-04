import { Model } from 'pinia-orm'
import District from '../district/District';
import CommunityMobilizer from '../mobilizer/CommunityMobilizer';
import Province from '../province/Province';
import Utente from '../utente/Utente';
//import { DistrictUserLogin } from './UserLoginHierarchy'
//import { MobilizerLogin } from './UserLoginHierarchy'
//import { UtenteLogin } from './UserLoginHierarchy'
//import db from 'src/store/localbase'

export class UserLogin extends Model {
  static entity = 'userLogins'
  static primaryKey = 'id'

/*
static types () {
  return {
    DISTRICTUSERLOGIN: DistrictUserLogin,
    UserLogin: UserLogin,
    MOBILIZERLOGIN: MobilizerLogin,
    UTENTELOGIN: UtenteLogin,
  }
}
*/
  static fields () {
    return {
      id: this.attr(null),
      username: this.attr(''),
      password: this.attr(''),
      role: this.attr(null),
      fullName: this.attr(''),
      access_token: this.attr(''),
      refresh_token: this.attr(''),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      province_id: this.attr(''),
      district_id: this.attr(''),
      clinic_id: this.attr(''),
      utente_id: this.attr(null),
      utente: this.belongsTo(Utente, 'utente_id'),
      mobilizer_id: this.attr(null),
      mobilizer: this.belongsTo(CommunityMobilizer, 'mobilizer_id'),
      district: this.belongsTo(District, 'district_id'),
      province: this.belongsTo(Province, 'province_id'),
      source: this.attr('')
    }
  }
  static piniaOptions = {
    persist: true,
  };

}
