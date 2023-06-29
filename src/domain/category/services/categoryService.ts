import { inject, injectable } from "tsyringe";
import { ICategoryService } from "../types/ICategoryService";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { ICategory } from "../types/ICategory";
import { tokens } from "@di/tokens";
import { ICategoryRepository } from "../types/ICategoryRepository";
import { IKafkaAdapter } from "@infrastructure/types/IkafkaAdapter";

@injectable()
export default class CategoryService implements ICategoryService {

    constructor(
        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,

        @inject(tokens.KafkaClient)
        private kafkaClient: IKafkaAdapter,
    ) { }

    find(params: Partial<IQueryData>): Promise<IPagination<ICategory>> {
        return this.categoryRepository.find(params);
    }

    findById(id: string | number): Promise<ICategory> {
        return this.categoryRepository.findById(id);
    }

    create(data: ICategory): Promise<void> {
        return this.categoryRepository.create(data);
    }

    async createAsync(data: ICategory): Promise<void> {
        await this.kafkaClient.execute({topic: "Queuing.Example.Category", data});
    }

    update(id: string | number, data: ICategory): Promise<void> {
        return this.categoryRepository.update(id, data);
    }

    delete(id: string | number): Promise<void> {
        return this.categoryRepository.delete(id);
    }

}