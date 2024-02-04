import { Model } from 'pinia-orm'
//import db from 'src/store/localbase'

export default class VMMCArticle extends Model {
  static entity = 'VMMCArticles'
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.attr(null),
      seq: this.attr(''),
      text: this.attr('')
    }
  }

  static piniaOptions = {
    persist: true,
  };
}
