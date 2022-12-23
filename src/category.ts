import { Pool, PoolClient } from 'pg'
import { BaseModel, IBaseModel } from "models";
import { BaseRepository, IBaseRepository } from 'repositories/base.repository';
import { PrimaryKey } from 'types';
import { pool } from './config';
import { BaseService, BaseServiceWithEav, IBaseEntityEav, IBaseService } from 'services/base.service';

/** eav */
interface EavEntity {
  id: number;
  name: string;
  label: string;
  type_id: number;
  input_type: string;
  rules ?: any;
}

interface IEavModel extends IBaseModel<EavEntity, PoolClient> {}
class EavModel extends BaseModel<EavEntity> {
  constructor({ pool }: { pool: Pool }) {
    super({
      pool,
      table: 'eav',
      primaryKey: 'eav_id',
      mapping: {
        id: 'eav_id',
        name: 'name',
        label: 'label',
        type_id: 'type_id',
        input_type: 'input_type',
        rules: 'rules'
      }
    })
  }
}

interface IEavRepository extends IBaseRepository<EavEntity> {

}
class EavRepository extends BaseRepository<EavEntity, IEavModel> implements IEavRepository {
  all(): Promise<EavEntity[]> {
    throw new Error('Method not implemented.');
  }

}
/** eav */

interface BaseEavValueEntity {
  value_id: number;
  eav_id: number;
  entity_id: number;
  value: string;
}
interface IBaseEavValueModel extends IBaseModel<BaseEavValueEntity, PoolClient>{}
abstract class BaseEavValueModel extends BaseModel<BaseEavValueEntity> implements IBaseEavValueModel {
  constructor({ pool, table } : { pool: Pool, table: string }) {
    super({
      pool,
      table,
      primaryKey: 'value_id',
      mapping: {
        value_id: 'value_id',
        eav_id: 'eav_id',
        entity_id: 'entity_id',
        value: 'value'
      }
    })
  }
}

interface HasEav<T> {
  attributes ?: Array<T>
}

interface CategoryEntity {
  id: number;
  name: string;
  parent_id?: number | null;
}

interface ICategoryModel extends IBaseModel<CategoryEntity, PoolClient> {}
class CategoryModel extends BaseModel<CategoryEntity> implements ICategoryModel {
  constructor({ pool } : { pool: Pool }) {
    super({
      pool,
      table: 'catalog_category',
      primaryKey: 'entity_id',
      mapping: {
        id: 'entity_id',
        name: 'name',
        parent_id: 'parent_id'
      }
    });
  }
}

interface ICategoryRepository extends IBaseRepository<CategoryEntity> {}
class CategoryRepository extends BaseRepository<CategoryEntity, ICategoryModel> implements ICategoryRepository {
  all(): Promise<CategoryEntity[]> {
    throw new Error('Method not implemented.');
  }
}

class CategoryEavService extends BaseServiceWithEav<CategoryEntity, EavEntity, ICategoryRepository> implements ICategoryService {
  async get(id: PrimaryKey): Promise<IBaseEntityEav<CategoryEntity, EavEntity>> {
    return {
      id: 1,
      name: '', 
      parent_id: 1,
      attributes: []
    }
  }
}

interface ICategoryService extends IBaseService<CategoryEntity, ICategoryRepository> {}
class CategoryService extends BaseService<CategoryEntity, ICategoryRepository> implements ICategoryService {
  public eavRepository: any;

  constructor({ pool, repository, eavRepository }: { pool: Pool, repository: any, eavRepository: any }) {
    super({ pool, repository });

    this.eavRepository = eavRepository;
  }

  async get(id: PrimaryKey): Promise<CategoryEntity> {
    return { 
      id: 1,
      name: '',
      parent_id: 1,
    }
    return await this.repository.getById(id);
  }
}

const model = new CategoryModel({ pool });
const repository = new CategoryRepository({ pool, model});
const service = new CategoryService({ 
  pool, repository, eavRepository: new CategoryRepository({pool, model}) 
});



// EAV EXAMPLE -----------------------------
interface CategoryEavValue extends BaseEavValueEntity{

}
class CategoryEavValueModel extends BaseModel<CategoryEavValue> {
  constructor({ pool } : { pool: Pool }) {
    super({
      pool,
      table: 'catalog_category_eav',
      primaryKey: 'value_id',
      mapping: {
        eav_id: 'eav_id',
        entity_id: 'entity_id',
        value: 'value',
        value_id: 'value_id'
      }
    })
  }
}
class CategoryEavRepositoryValue extends BaseRepository<CategoryEavValue, CategoryEavValueModel> {
  public modelEav: EavModel;
  constructor({ pool, model, modelEav } : { pool: Pool, model: CategoryEavValueModel, modelEav: EavModel }) {
    super({ pool, model })
    this.modelEav = modelEav;
  }

  all(): Promise<CategoryEavValue[]> {
    this.model.create({});

    throw new Error('Method not implemented.');
  }

  async assignToProduct() {
    this.model.create({})
    // this.modelEav.
  }

}

interface CategoryEnvEntity extends IBaseEntityEav<CategoryEntity, EavEntity> {}
interface ICategoryEavModel extends IBaseModel<CategoryEnvEntity, PoolClient> {}
class CategoryEavModel extends BaseModel<CategoryEnvEntity> implements ICategoryEavModel {
  constructor({ pool } : { pool: Pool }) {
    super({
      pool,
      table: 'catalog_category_eav',
      primaryKey: 'entity_id',
      mapping: {
        id: 'id',
        name: 'name',
        parent_id: 'parent_id',
        attributes: 'attributes' // check
      }
    });
  }
}
interface ICategoryEavRepository extends IBaseRepository<CategoryEnvEntity> {}
class CategoryEavRepository extends BaseRepository<CategoryEnvEntity, ICategoryModel> implements ICategoryEavRepository {
  all(): Promise<CategoryEntity[]> {
    throw new Error('Method not implemented.');
  }
  async getById(id: PrimaryKey): Promise<CategoryEnvEntity> {
    const data = await this.model.findOne(id);
    return {
      id: 1,
      name: 'name',
      parent_id: 1,
      attributes: []
    }
  }
}
const modelEav = new CategoryEavModel({ pool });
const eavCategoryRepository = new CategoryEavRepository({ pool, model: modelEav });// IBaseRepository<IBaseEntityEav<CategoryEntity, EavEntity>>;
const serviceEav = new CategoryEavService({
  pool,
  _repository: repository,
  repository: eavCategoryRepository 
});