import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { IInvestment, IInvestmentBalanceSync } from "../types/IInvestiment";
import { IInvestmentRepository } from "../types/IInvestmentRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import { Knex } from "knex";
import knex from "@infrastructure/knex/knex";
import Common from "@helpers/Common";

@injectable()
export default class InvestmentRepository extends RepositoryBase<IInvestment> implements IInvestmentRepository {
    
    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("investment", { pageSize: 100, redis });
    }

    getSyncBalances(trx?: Knex.Transaction<any, any[]> | undefined): Promise<IInvestmentBalanceSync[]> {
        const query = this.context
            .select(
                `${this.tbName}.id`,
                `${this.tbName}.name`,
                `${this.tbName}.balance`,
                knex.raw("TRUNCATE(SUM(transaction.total), 2) as asyncBalance"),
            )
            .innerJoin("transaction", "transaction.investmentId", "=", `${this.tbName}.id`)
            .groupBy(`${this.tbName}.id`);

        return Common.transacting(query, trx);
    }

    async getBalance(id: string | number, trx?: Knex.Transaction): Promise<number> {
        const query = this.context.select(knex.raw("TRUNCATE(SUM(transaction.total), 2) as balance"))
        .innerJoin("transaction", "transaction.investmentId", "=", `${this.tbName}.id`)
        .where({
            [`${this.tbName}.id`]: id
        }).first();
        const { balance } = await Common.transacting(query, trx);
        return balance;
    }
}
