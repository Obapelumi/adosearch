# adosearch

Adosearch is an [Adonis.js Query Scope](https://docs.adonisjs.com/guides/models/query-scopes#document) that makes advanced search across multiple models trivial to implement.
Inspired by the [sofa/eloquence-base](https://github.com/jarektkaczyk/eloquence/wiki/Builder-searchable-and-more) laravel package.

## Installation

Using NPM

```
npm install adosearch
```

Or Yarn

```
yarn add adosearch
```

## Usage

All you have to do is is define it as static property on the model class by calling the `search` function from adosearch.

```ts
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { search } from 'adosearch'

export default class User extends BaseModel {
  // ... other model properties
  public static search = search(this, ['name', 'email', 'username', 'phone'])
}
```

And then apply the search scope like so:

```ts
User.query().withScopes((scopes) => scopes.search('john doe'))
```

Just like that we've created a Query Scope that searches for `john doe` in the name, email, username & phone columns of the users table.

We could also specify the columns to search on the fly like so:

```ts
// search columns name and email for john doe
User.query().withScopes((scopes) => scopes.search('john doe', ['name', 'email']))
```

## Searching Related Models

Adosearch allows you to search across multiple related models several layers deep. For example, if we have a `Post` model that belongs to a `Category` model and has many comments, we would typically set these relationships up in Adonis like so:

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

Now, say we wanted to search for all the posts for a certain category name. We specify that in our `Post` model:

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

And then we can apply the search scope:

```ts
Post.query().withScopes((scopes) => scopes.search('life style'))

// or on the fly
Post.query().withScopes((scopes) => scopes.search('life style', ['title', 'category.name']))
```

We could go deeper and search for all comments on posts belonging to a category. For example:

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

Apply the search scope:

```ts
Comment.query().withScopes((scopes) => scopes.search('life style'))
```

This is a relatively simple example, but we could go as deep as we want while adosearch generates the complex SQL queries for us on the fly.

And guess what? It has type support 🤩

<img width="851" alt="image" src="https://user-images.githubusercontent.com/31254017/175785612-161a9f1c-327c-4919-98c6-4d0983fc727f.png">

## Computed Search

Adosearch also provides a handy way to change the search value for a specific column before searching for it. In the example below we want to search by post status which are stored as numbers in the database:

```ts
import { column, BaseModel, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { search } from '../src/search'
import Category from './Category'
import Comment from './Comment'

enum PostStatus {
  draft = 0,
  public = 1,
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
```

Now when a user types `draft` or `public` it gets converted to the respective enum values before searching the status column in the Database.


## Limitations

1. Does not yet support the `hasManyThrough` relationship.
2. The column suggestions in typescript might include getter properties if their return type is `string | number | bigint | boolean | DateTime`.
