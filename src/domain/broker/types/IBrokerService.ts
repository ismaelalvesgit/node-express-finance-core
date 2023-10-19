import { IPagination, IQueryData } from "@helpers/ICommon";
import { IBroker } from "./IBroker";

export interface IBrokerService {
    find(params: Partial<IQueryData>): Promise<IPagination<IBroker>>
    findById(id: number | string): Promise<IBroker>
    create(data: IBroker): Promise<void>
    update(id: number | string, data: IBroker): Promise<void>
    delete(id: number | string): Promise<void>
}