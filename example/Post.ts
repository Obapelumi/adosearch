import { column, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { search } from 'index'
import Category from './Category'
import Comment from './Comment'

export default class Post extends BaseModel {
  @column()
  public title: string

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  public static search = search(this, ['title', 'category.name', 'comments.text'])
}
