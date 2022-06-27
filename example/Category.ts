import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { search } from '../src/search'
import Post from './Post'

export default class Category extends BaseModel {
  @column()
  public name: string

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  public static search = search(this, ['name', 'posts.comments.text', 'posts.title'])
}
