import { Model } from 'pinia-orm'
import District from '../district/District'

export default class Province extends Model {
  static entity = 'provinces'
  static primaryKey = 'id';
  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      code: this.attr(''),
      // Relationships
      districts: this.hasMany(District, 'province_id')

    }
  }
  static piniaOptions = {
    persist: true,
  };
}
