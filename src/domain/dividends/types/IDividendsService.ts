import { IPagination, IQueryData } from "@helpers/ICommon";
import { IDividends } from "./IDividends";

export interface IDividendsService {
    find(params: Partial<IQueryData>): Promise<IPagination<IDividends>>
    findById(id: number | string): Promise<IDividends>
    create(data: IDividends): Promise<void>
    update(id: number | string, data: IDividends): Promise<void>
    paid(dueDate: Date): Promise<void>
    autoCreate(data: IDividends[]): Promise<void>
    delete(id: number | string): Promise<void>
}