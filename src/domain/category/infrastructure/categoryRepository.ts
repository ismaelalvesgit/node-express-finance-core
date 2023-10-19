import { injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { ICategory } from "../types/ICategory";
import { ICategoryRepository } from "../types/ICategoryRepository";

@injectable()
export default class CategoryRepository extends RepositoryBase<ICategory> implements ICategoryRepository {
    constructor( ) {
        super("category", { readonly: true });
    }
}
