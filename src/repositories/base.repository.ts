import { Pool, PoolClient } from 'pg';
import { BaseModel, IBaseModel } from '../models/';
import { PrimaryKey } from '../types';

export interface IBaseRepository<Entity> {

  all(): Promise<Array<Entity>>;
  // get(args: IParams): Promise<Array<Entity>>
  getById(id: PrimaryKey): Promise<Entity>;
  create(item: Entity, tx?: PoolClient) : Promise<Entity>;
  update(id: PrimaryKey, item: Entity, tx?: PoolClient) : Promise<Entity>;
  delete(id: PrimaryKey, tx?: PoolClient) : Promise<boolean>;
}

export abstract class BaseRepository<Entity, Model extends IBaseModel<Entity, PoolClient>> implements IBaseRepository<Entity> {
  public pool: Pool;
  public model: Model;

  constructor({ pool, model } : { pool: Pool, model: Model }) {
    this.pool = pool;
    this.model = model;
  }

  abstract all(): Promise<Entity[]>;
  // abstract get(args: IParams): Promise<Entity[]>;
  async getById(id: PrimaryKey): Promise<Entity> {
    return await this.model.findOne(id);
  }
  async create(entity: Entity, tx?: PoolClient | undefined): Promise<Entity> {
    return await this.model.create(entity);
  }
  async update(id: PrimaryKey, entity: Entity, tx?: PoolClient | undefined): Promise<Entity> {
    return await this.model.update(id, entity, tx);
  }
  async delete(id: PrimaryKey): Promise<boolean> {
    return await this.model.delete(id);
  }
}