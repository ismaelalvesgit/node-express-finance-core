import { inject, injectable } from "tsyringe";
import RepositoryBase from "@infrastructure/repository/repositoryBase";
import { IEvents } from "../types/IEvents";
import { IEventsRepository } from "../types/IEventsRepository";
import { tokens } from "@di/tokens";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";

@injectable()
export default class EventsRepository extends RepositoryBase<IEvents> implements IEventsRepository {

    constructor(
        @inject(tokens.RedisClient)
        redis: IRedisAdapter,
    ) {
        super("events", {redis});
    }

    async batchCreate(data: IEvents[]): Promise<void> {
        await this.transaction((trx)=>{
            return Promise.all(data.map((event) => {
                const { investmentId, link } = event;
                return this.findOrCreate(event, trx, {
                    investmentId,
                    link
                });
            }));
        });
    }
}