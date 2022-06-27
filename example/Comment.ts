import Search from '@ioc:Adonis/Addons/Search'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class Comment extends BaseModel {
  @column()
  public text: string

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  public static search = Search(this, ['text', 'post.category.name', 'post.title'])
}
