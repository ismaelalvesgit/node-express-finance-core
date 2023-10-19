import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { ITransaction, ITransactionBrokerQntCount, ITransactionLastAveragePrice } from "../types/ITransaction";
import { ITransactionRepository } from "../types/ITransactionRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import { Knex } from "knex";
import Common from "@helpers/Common";
import { BrokerSelect } from "@domain/broker/types/IBroker";
import knex from "@infrastructure/knex/knex";

@injectable()
export default class TransactionRepository extends RepositoryBase<ITransaction> implements ITransactionRepository {

    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("transaction", { redis });
    }

    getLastAveragePrice(filter: Pick<ITransaction, "investmentId" | "id">, trx?: Knex.Transaction): Promise<ITransactionLastAveragePrice> {
        const query = this.context.select([
            knex.raw("TRUNCATE(SUM((total + fees + brokerage + taxes)) / SUM(qnt), 0) as priceAverage"),
            knex.raw("TRUNCATE(SUM(total), 2) as balance"),
            knex.raw("TRUNCATE(SUM(qnt), 0) as quantity"),
        ]).where({
            investmentId: filter.investmentId
        })
        .whereNot("id", filter.id)
        .first();

        return Common.transacting(query, trx);
    }

    findTransactionByBrokerQntCount(
        filter: Partial<Pick<ITransaction, "brokerId" | "investmentId">>,
        negotiationDate: Date, 
        trx?: Knex.Transaction
    ): Promise<ITransactionBrokerQntCount[]> {
        const query = this.context.select([
            knex.raw(Common.jsonQuerySelect("broker", BrokerSelect)),
            knex.raw(`SUM(${this.tbName}.qnt) as qnt`),
            knex.raw("investment.currency as currency"),
        ])
        .sum({ qnt: "qnt" })
        .innerJoin("broker", "broker.id", "=", `${this.tbName}.brokerId`)
        .innerJoin("investment", "investment.id", "=", `${this.tbName}.investmentId`)
        .groupBy("broker.id")
        .where({...filter})
        .where("negotiationDate", "<=", negotiationDate);

        return Common.transacting(query, trx);
    }
}