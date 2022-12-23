import type { PoolClient } from 'pg'
import { PrimaryKey } from '../types'

export type AnyObject = Record<string, any>
export type ColumnData = string | {
  name: string
  hidden?: boolean
}
interface Writer<T, C> {
  create(value: Partial<T>, tx?: C): Promise<T>
  createMany(values: Partial<T>[], tx?: C): Promise<T[]>
  update(id: PrimaryKey, newValue: Partial<T>, tx?: C): Promise<T>
  delete(id: PrimaryKey, tx?: C): Promise<boolean>
}

export interface FindOptions<T, C> {
  select?: Array<keyof T>
  tx?: C
}

interface Reader<T, C> {
  find(value: Partial<T>, options?: FindOptions<T, C>): Promise<T[]>
  findOne(id: PrimaryKey | Partial<T>, options?: FindOptions<T, C>): Promise<T>
  exist(id: PrimaryKey | Partial<T>, tx?: PoolClient): Promise<boolean>
  findLike(value: Partial<T>, options?: FindOptions<T, C>) : Promise<Array<T>>
}


export type IBaseModel<T, C> = Writer<T, C> & Reader<T, C>
