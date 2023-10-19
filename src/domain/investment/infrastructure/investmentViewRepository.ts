import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { IInvestment } from "../types/IInvestiment";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import { IInvestmentViewRepository } from "../types/IInvestmentViewRepository";

@injectable()
export default class InvestmentViewRepository extends RepositoryBase<IInvestment> implements IInvestmentViewRepository {
    
    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("view_investment", { pageSize: 100, redis, readonly: true, jsonAttributes: ["category"] });
    }
}
