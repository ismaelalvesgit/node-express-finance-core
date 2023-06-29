import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { IProduct } from "../types/IProduct";
import { IProductRepository } from "../types/IProductRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";

@injectable()
export default class ProductRepository extends RepositoryBase<IProduct> implements IProductRepository {

    constructor(
        @inject(tokens.RedisClient)
        private redis: IRedisAdapter,
    ) {
        super("product");
    }

    async create(data: IProduct): Promise<void> {
        await super.create(data);
        await this.redis.deleteByPrefix("product");
    }

    async delete(id: string | number): Promise<void> {
        await Promise.all([
            super.delete(id),
            this.redis.deleteByPrefix("product")
        ]);
    }

    async update(id: string | number, data: IProduct): Promise<void> {
        await super.update(id, data);
        await this.redis.deleteByPrefix("product");
    }
}