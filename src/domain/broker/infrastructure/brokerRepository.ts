import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { IBroker } from "../types/IBroker";
import { IBrokerRepository } from "../types/IBrokerRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";

@injectable()
export default class BrokerRepository extends RepositoryBase<IBroker> implements IBrokerRepository {

    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("broker", {pageSize: 100, redis});
    }
}
