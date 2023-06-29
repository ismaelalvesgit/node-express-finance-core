import { IPagination, IQueryData } from "@helpers/ICommon";
import { ICategory } from "./ICategory";

export interface ICategoryService {
    find(params: Partial<IQueryData>): Promise<IPagination<ICategory>>
    findById(id: number | string): Promise<ICategory>
    createAsync(data: ICategory): Promise<void>
    create(data: ICategory): Promise<void>
    update(id: number | string, data: ICategory): Promise<void>
    delete(id: number | string): Promise<void>
}