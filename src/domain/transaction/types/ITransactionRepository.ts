import { IReposioryBase } from "@infrastructure/types/IRepositoryBase";
import { ITransaction, ITransactionBrokerQntCount, ITransactionLastAveragePrice } from "./ITransaction";
import { Knex } from "knex";

export type ITransactionRepository = IReposioryBase<ITransaction> & {
    findTransactionByBrokerQntCount(
        filter: Partial<Pick<ITransaction, "brokerId" | "investmentId">>, 
        negotiationDate: Date, 
        trx?: Knex.Transaction
    ): Promise<ITransactionBrokerQntCount[]>
    getLastAveragePrice(filter: Pick<ITransaction, "id" | "investmentId">, trx?: Knex.Transaction): Promise<ITransactionLastAveragePrice>
}