# adosearch

Adosearch is an [Adonis.js Query Scope](https://docs.adonisjs.com/guides/models/query-scopes#document) that makes advanced search across multiple models trivial to implement.

## Installation

With npm

```
npm install adosearch
```

Or Yarn

```
yarn add adosearch
```

## Usage

All you have to do is add it as a scope in your Lucid models. For example:

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

Here we specify the columns we want to search through by calling the `search` function from adosearch which creates a Query Scope.

Now we can apply the search scope:

```ts
User.query().withScopes((scopes) => scopes.search(searchString))
```

We could also specify the columns to search on the fly like so:

```ts
User.query().withScopes((scopes) => scopes.search(searchString, ['name', 'email']))
```

## Searching Related Models

Adosearch allows you to search across related models several layers deep. For example, if we have a `Post` model that belongs to a `Category` model and has many comments, we would typically set these relationships up in Adonis like so:

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

Now, say we wanted to search for all the posts in a certain category. We can specify that in our `Post` model:

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

We could go deeper and search for all comments on posts belonging to a category. We just have to specify that on the `Comment` model:

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

This is a simple example but we could go as deep as we want and adosearch generates the SQL queries we need on the fly.

And guess what? It's fully typed 🤩

<img width="851" alt="image" src="https://user-images.githubusercontent.com/31254017/175785612-161a9f1c-327c-4919-98c6-4d0983fc727f.png">
