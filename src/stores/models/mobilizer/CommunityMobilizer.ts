import { Model } from 'pinia-orm'
import Utente from '../utente/Utente'
import InfoDocsOrImages from '../dorcOrImages/InfoDocsOrImages'
import District from '../district/District'
export default class CommunityMobilizer extends Model {
  static entity = 'communityMobilizers'
  static primaryKey = 'id';

  static fields () {
    return {
      id: this.attr(null),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      cellNumber: this.attr(''),
      cellNumber2: this.attr(''),
      uuid: this.attr(''),
      district_id: this.attr(''),
      // Relationships
      utentes: this.hasMany(Utente, 'communityMobilizer_id'),
      docsOrImages: this.hasMany(InfoDocsOrImages, 'docsOrImages_id'),
      district: this.belongsTo(District, 'district_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };
}
