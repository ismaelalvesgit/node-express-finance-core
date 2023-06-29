import { IPagination, IQueryData } from "@helpers/ICommon";
import { IProduct } from "./IProduct";

export interface IProductService {
    find(params: Partial<IQueryData>): Promise<IPagination<IProduct>>
    findById(id: number | string): Promise<IProduct>
    create(data: IProduct): Promise<void>
    createAsync(data: IProduct): Promise<void>
    update(id: number | string, data: IProduct ): Promise<void>
    delete(id: number | string): Promise<void>
 }