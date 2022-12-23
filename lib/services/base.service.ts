import { PrimaryKey } from "../types";
import { IBaseRepository } from "../repositories/base.repository";
import { Pool } from "pg";

export interface IBaseService<Entity, Repository> {
  get(id: PrimaryKey) : Promise<Entity>;
}

interface WithEav<T> {
  attributes ?: Array<T>
}

export abstract class BaseService<Entity, Repository> implements IBaseService<Entity, Repository>{
  public repository: IBaseRepository<Entity>;
  public pool: Pool;

  constructor({ pool, repository } : { pool: Pool, repository: IBaseRepository<Entity> }) {
    this.repository = repository;
    this.pool = pool;
  }

  abstract get(id: PrimaryKey): Promise<Entity>;
}

export type IBaseEntityEav<Entity, EavEntity> = Entity & WithEav<EavEntity>

export abstract class BaseServiceWithEav<Entity, EavEntity, Repository> extends BaseService<IBaseEntityEav<Entity, EavEntity>, Repository> {

  public _repository: IBaseRepository<Entity>;
  // public repository: IBaseRepository<IBaseEntityEav<Entity, EavEntity>>;

  constructor({ pool, repository, _repository } : { pool: Pool, repository: IBaseRepository<IBaseEntityEav<Entity, EavEntity>>, _repository: IBaseRepository<Entity> }) {
    super({
      pool,
      repository,
    });
    this._repository = _repository;
  }
}
