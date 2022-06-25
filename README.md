# adosearch

typed, deeply nested database search for adonis.js applications

## Installation

```
npm install adosearch
```

## Usage

Adosearch leverages [Adonis.js' query scopes](https://docs.adonisjs.com/guides/models/query-scopes#document). Here is an example of how you can add a search scope to your Lucid models:

```ts
import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { search } from 'adosearch'

export default class User extends BaseModel {
  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static search = search(this, ['name', 'email', 'username', 'phone'])
}
```

Here we specify the columns we want to search through by calling the `search` function from adosearch which creates a Query Scope. We can apply your search scope like so:

```ts
User.query().withScopes((scopes) => scopes.search(searchString))
```

You could also specify the columns to search on the fly like so:

```ts
User.query().withScopes((scopes) => scopes.search(searchString, ['name', 'email']))
```

## Searching Related Models

Adosearch allows you to search through related models several layers deep. For example, if we have a `Post` model that has many comments and the `Post` model also belongs to a `Category` model. We would typically set these relationships up in Adonis like so:

```ts
import { column, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

class Post extends BaseModel {
  @column()
  public title: string

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}

class Category extends BaseModel {
  @column()
  public name: string

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}

class Comment extends BaseModel {
  @column()
  public text: string

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>
}
```

Now, say we wanted to search for all posts in a certain category. We can specify that in our `Post` model:

```ts
import { search } from 'adosearch'

class Post extends BaseModel {
  //... other properties
  public static search = search(this, [
    // other fields to search
    'category.name',
  ])
}
```

And then:

```ts
Post.query().withScopes((scopes) => scopes.search('life style'))

// or on the fly
Post.query().withScopes((scopes) => scopes.search('life style', ['title', 'category.name']))
```

We could go deeper and search for all comments on posts belonging to a category. We would just specify that on the `Comment` model:

```ts
import { search } from 'adosearch'

class Comment extends BaseModel {
  //... other properties
  public static search = search(this, [
    // other fields to search
    'post.category.name',
  ])
}
```

And then:

```ts
Comment.query().withScopes((scopes) => scopes.search('life style'))
```

We could go as deep as we want and adosearch will generate the SQL queries we need on the fly.

And guess what? It's fully typed 🤩

<img width="851" alt="image" src="https://user-images.githubusercontent.com/31254017/175785612-161a9f1c-327c-4919-98c6-4d0983fc727f.png">
