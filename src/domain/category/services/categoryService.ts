import { inject, injectable } from "tsyringe";
import { ICategoryService } from "../types/ICategoryService";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { ECategoryType, ICategory } from "../types/ICategory";
import { tokens } from "@di/tokens";
import { ICategoryRepository } from "../types/ICategoryRepository";
import { Knex } from "knex";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";

@injectable()
export default class CategoryService implements ICategoryService {

    constructor(
        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,

        @inject(tokens.RedisClient)
        private redis: IRedisAdapter,
    ) { }

    find(params: Partial<IQueryData>): Promise<IPagination<ICategory>> {
        return this.categoryRepository.find(params);
    }

    async findById(id: string | number): Promise<ICategory> {
        const key = `category:id:${id}`;
        const cache = await this.redis.get(key);
        if(cache) return cache as unknown as ICategory;
        const category = await this.categoryRepository.findById(id);
        await this.redis.setNoExp(key, JSON.stringify(category));
        return category;
    }

    async findByIdOrName(params:{id?: string | number, name?: ECategoryType}, trx?: Knex.Transaction): Promise<ICategory | undefined>{
        if(!params.id && !params.name) return undefined;
        
        const keyId = `category:id:${params.id}`;
        const keyName = `category:name:${params.name}`;

        const [idR, nameR] = await Promise.all([
            this.redis.get(keyId),
            this.redis.get(keyName)
        ]);

        if(idR || nameR) return (idR || nameR) as unknown as ICategory;

        const categoryQuery = this.categoryRepository.query(trx);
        if(params?.id) categoryQuery.where({id: params.id});
        if(params?.name) categoryQuery.where({name: params.name});

        const category = await categoryQuery.first();
        if(!category) undefined;

        if(params?.id) await this.redis.setNoExp(keyId, JSON.stringify(category));
        if(params?.name) await this.redis.setNoExp(keyName, JSON.stringify(category));
        return category;
    }
}
