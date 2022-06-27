import Search from '@ioc:Adonis/Addons/Search'
import { column, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Comment from './COmment'

export default class Post extends BaseModel {
  @column()
  public title: string

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  public static search = Search(this, ['title', 'category.name', 'comments.text'])
}
