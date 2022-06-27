/// <reference types="@adonisjs/lucid" />

declare module '@ioc:Adonis/Addons/Search' {
  import {
    LucidRow,
    LucidModel,
    ModelQueryBuilderContract,
    ModelRelations,
  } from '@ioc:Adonis/Lucid/Orm'
  import { DateTime } from 'luxon'

  type Column = string | number | bigint | boolean | DateTime
  type RelationPathPlotter<Key, Value, DuplicateModels> = Key extends string
    ? Value extends Column
      ? Key
      : Value extends ModelRelations
      ? Value['instance'] extends DuplicateModels
        ? never
        : `${Key}.${RelationPath<Value['instance'], DuplicateModels | Value['instance']>}`
      : never
    : never
  type RelationPath<Model extends LucidRow, DuplicateModels = Model> = {
    [Key in keyof Model]: RelationPathPlotter<Key, Model[Key], DuplicateModels>
  }[keyof Omit<Model, keyof LucidRow>]

  const Search: <Model extends LucidModel>(
    model: Model,
    defaultColumns: RelationPath<InstanceType<Model>, InstanceType<Model>>[]
  ) => import('@ioc:Adonis/Lucid/Orm').QueryScope<
    (
      mainQuery: ModelQueryBuilderContract<Model, InstanceType<Model>>,
      search: string,
      columns?: RelationPath<InstanceType<Model>, InstanceType<Model>>[] | undefined
    ) => void
  >
  export default Search
}
