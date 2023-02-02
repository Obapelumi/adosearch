import { column, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { search } from '../src/search'
import Category from './Category'
import Comment from './Comment'

enum PostStatus {
  draft,
  public,
}

export default class Post extends BaseModel {
  @column()
  public title: string

  @column({ serialize: (s) => PostStatus[s] })
  public status: PostStatus

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  public static search = search(this, ['title', 'category.name', 'comments.text', 'status'], {
    status: (s: string) => PostStatus[s.trim().toLowerCase()],
  })
}
