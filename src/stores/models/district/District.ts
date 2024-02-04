import { Model } from 'pinia-orm'
import Province from '../province/Province'
// import Address from '../address/Address'
//import db from 'src/store/localbase'

export default class District extends Model {
  static entity = 'districts'
  static primaryKey = 'id';
  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      province_id: this.attr(''),

      // Relationshiops
      province: this.belongsTo(Province, 'province_id')
    //  addresses: this.hasMany(Address, 'district_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
