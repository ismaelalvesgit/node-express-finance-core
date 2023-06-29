import { inject, injectable } from "tsyringe";
import { ICategoryService } from "../types/ICategoryService";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { ICategory } from "../types/ICategory";
import { tokens } from "@di/tokens";
import { ICategoryRepository } from "../types/ICategoryRepository";

@injectable()
export default class CategoryService implements ICategoryService {

    constructor(
        @inject(tokens.CategoryRepository)
        private categoryRepository: ICategoryRepository,
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

    update(id: string | number, data: ICategory): Promise<void> {
        return this.categoryRepository.update(id, data);
    }

    delete(id: string | number): Promise<void> {
        return this.categoryRepository.delete(id);
    }

}