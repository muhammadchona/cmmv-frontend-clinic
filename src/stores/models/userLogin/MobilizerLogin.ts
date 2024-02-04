import CommunityMobilizer from '../mobilizer/CommunityMobilizer'
import { UserLogin } from './UserLoginHierarchy'

export class MobilizerLogin extends UserLogin {
  static entity = 'mobilizerLogins'
  static baseEntity = 'userLogins'

  static fields () {
    return {
        ...super.fields(),
        mobilizer_id: this.attr(null),
        mobilizer: this.belongsTo(CommunityMobilizer, 'mobilizer_id')
    }
  }
}
