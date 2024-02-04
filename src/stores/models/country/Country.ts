import { Model } from 'pinia-orm'
import Province from '../province/Province'
// import db from 'src/store/localbase'

export default class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      nacionality: this.attr(''),
      code: this.attr(''),

      // Relationshiops
      provinces: this.hasMany(Province, 'country_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
