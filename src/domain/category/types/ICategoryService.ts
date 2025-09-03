import { IPagination, IQueryData } from "@helpers/ICommon";
import { ECategoryType, ICategory } from "./ICategory";
import { Knex } from "knex";

export interface ICategoryService {
    find(params: Partial<IQueryData>): Promise<IPagination<ICategory>>
    findById(id: number | string): Promise<ICategory>
    findByIdOrName(params:{id?: string | number, name?: ECategoryType}, trx?: Knex.Transaction): Promise<ICategory | undefined>
}
