import { IReposioryBase } from "@infrastructure/types/IRepositoryBase";
import { IDividends, IDividendsChangeStatus } from "./IDividends";
import { Knex } from "knex";

export type IDividendsRepository = IReposioryBase<IDividends> & {
    findUpdateStatusByPaid(date: string, trx?: Knex.Transaction): Promise<IDividendsChangeStatus[]>
}