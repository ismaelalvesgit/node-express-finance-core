import { IPagination, IQueryData } from "@helpers/ICommon";
import { ICategory } from "./ICategory";

export interface ICategoryService {
    find(params: Partial<IQueryData>): Promise<IPagination<ICategory>>
    findById(id: number | string): Promise<ICategory>
}