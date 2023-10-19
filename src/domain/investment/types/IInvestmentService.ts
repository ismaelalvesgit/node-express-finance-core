import { IPagination, IQueryData } from "@helpers/ICommon";
import { IInvestment } from "./IInvestiment";
import { ECategoryType } from "@domain/category/types/ICategory";
import { IQuoteBrapi } from "./IBrapi";
import { Knex } from "knex";

export interface IInvestmentService {
    getQoute(symbol: string, category: ECategoryType): Promise<IQuoteBrapi>
    find(params: Partial<IQueryData>): Promise<IPagination<IInvestment>>
    findById(id: number | string): Promise<IInvestment>
    create(data: IInvestment, trx?: Knex.Transaction): Promise<void>
    update(id: number | string, data: IInvestment, trx?: Knex.Transaction): Promise<void>
    delete(id: number | string, trx?: Knex.Transaction): Promise<void>
    batchUpdate(data: IInvestment[]): Promise<IInvestment[]>
    updateBalance(id: number, trx?: Knex.Transaction): Promise<void>
    syncBalance(trx?: Knex.Transaction): Promise<void>
 }