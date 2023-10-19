import { IReposioryBase } from "@infrastructure/types/IRepositoryBase";
import { IInvestment, IInvestmentBalanceSync } from "./IInvestiment";
import { Knex } from "knex";

export type IInvestmentRepository = IReposioryBase<IInvestment> & {
    getBalance(id: number | string, trx?: Knex.Transaction): Promise<number>
    getSyncBalances(trx?: Knex.Transaction): Promise<IInvestmentBalanceSync[]>
}