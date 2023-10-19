import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { EDividendsStatus, IDividends, IDividendsChangeStatus } from "../types/IDividends";
import { IDividendsRepository } from "../types/IDividendsRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import knex from "@infrastructure/knex/knex";
import { Knex } from "knex";
import Common from "@helpers/Common";
import { InvestmentSelect } from "@domain/investment/types/IInvestiment";
import { BrokerSelect } from "@domain/broker/types/IBroker";
import { CategorySelect } from "@domain/category/types/ICategory";

@injectable()
export default class DividendsRepository extends RepositoryBase<IDividends> implements IDividendsRepository {
    
    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("dividends", { redis });
    }

    findUpdateStatusByPaid(date: string, trx?: Knex.Transaction): Promise<IDividendsChangeStatus[]> {
        const query = this.context.select([
            `${this.tbName}.*`,
            knex.raw(Common.jsonQuerySelect("investment", InvestmentSelect)),
            knex.raw(Common.jsonQuerySelect("broker", BrokerSelect)),
            knex.raw(Common.jsonQuerySelect("category", CategorySelect)),
        ])
        .innerJoin("investment", "investment.id", "=", `${this.tbName}.investmentId`)
        .innerJoin("category", "category.id", "=", "investment.categoryId")
        .innerJoin("broker", "broker.id", "=", `${this.tbName}.brokerId`)
        .where(`${this.tbName}.status`, "=", EDividendsStatus.PROVISIONED)
        .where(`${this.tbName}.dueDate`, "<=", date);

        return Common.transacting(query, trx);
    }
}