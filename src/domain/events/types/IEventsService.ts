import { IPagination, IQueryData } from "@helpers/ICommon";
import { IEvents } from "./IEvents";

export interface IEventsService {
    find(params: Partial<IQueryData>): Promise<IPagination<IEvents>>
    findById(id: number | string): Promise<IEvents>
    createBatch(data: IEvents[]): Promise<void>
}