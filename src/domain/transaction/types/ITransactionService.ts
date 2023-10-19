import { IPagination, IQueryData } from "@helpers/ICommon";
import { ITransaction, ITransactionEventQnt } from "./ITransaction";

export interface ITransactionService {
    find(params: Partial<IQueryData>): Promise<IPagination<ITransaction>>
    findById(id: number | string): Promise<ITransaction>
    create(data: ITransaction): Promise<void>
    update(id: number | string, data: ITransaction): Promise<void>
    delete(id: number | string): Promise<void>
    event(params: ITransactionEventQnt): Promise<void>
}