import { inject, injectable } from "tsyringe";
import { IProductService } from "../types/IProductService";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { IProduct } from "../types/IProduct";
import { tokens } from "@di/tokens";
import { IProductRepository } from "../types/IProductRepository";
import { IKafkaAdapter } from "@infrastructure/types/IkafkaAdapter";

@injectable()
export default class ProductService implements IProductService {

    constructor(
        @inject(tokens.ProductRepository)
        private productRepository: IProductRepository,

        @inject(tokens.KafkaClient)
        private kafkaClient: IKafkaAdapter,
    ) { }

    find(params: Partial<IQueryData>): Promise<IPagination<IProduct>> {
        return this.productRepository.find({
            ...params,
            join: [{
                tableName: "category",
                key: "id",
                reference: "categoryId",
                columns: ["id", "name", "imageUrl", "createdAt", "updatedAt"]
            }]
        });
    }

    findById(id: string | number): Promise<IProduct> {
        return this.productRepository.findById(id, [{
            tableName: "category",
            key: "id",
            reference: "categoryId",
            columns: ["id", "name", "imageUrl", "createdAt", "updatedAt"]
        }]);
    }

    create(data: IProduct): Promise<void> {
        return this.productRepository.create(data);
    }

    async createAsync(data: IProduct): Promise<void> {
        await this.kafkaClient.execute({topic: "Queuing.Example.Product", data});
    }

    update(id: string | number, data: IProduct): Promise<void> {
        return this.productRepository.update(id, data);
    }

    delete(id: string | number): Promise<void> {
        return this.productRepository.delete(id);
    }

}