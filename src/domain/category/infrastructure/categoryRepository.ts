import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { ICategory } from "../types/ICategory";
import { ICategoryRepository } from "../types/ICategoryRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import { IProduct } from "@domain/product/types/IProduct";

@injectable()
export default class CategoryRepository extends RepositoryBase<ICategory> implements ICategoryRepository {

    constructor(
        @inject(tokens.RedisClient)
        private redis: IRedisAdapter,
    ) {
        super("category");
    }

    async create(data: IProduct): Promise<void> {
        await super.create(data);
        await this.redis.deleteByPrefix("category");
    }

    async delete(id: string | number): Promise<void> {
        await Promise.all([
            super.delete(id),
            this.redis.deleteByPrefix("category")
        ]);
    }

    async update(id: string | number, data: ICategory): Promise<void> {
        await super.update(id, data);
        await this.redis.deleteByPrefix("category");
    }
}