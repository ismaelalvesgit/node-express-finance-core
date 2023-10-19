import { inject, injectable } from "tsyringe";
import { IEventsService } from "../types/IEventsService";
import { IQueryData, IPagination, IInnerJoinData } from "@helpers/ICommon";
import { IEvents } from "../types/IEvents";
import { tokens } from "@di/tokens";
import { IEventsRepository } from "../types/IEventsRepository";
import { InvestmentSelect } from "@domain/investment/types/IInvestiment";

@injectable()
export default class EventsService implements IEventsService {

    private defaultJoin: IInnerJoinData[] = [{
        tableName: "investment",
        key: "id",
        reference: "investmentId",
        columns: InvestmentSelect
    }];

    constructor(
        @inject(tokens.EventsRepository)
        private eventsRepository: IEventsRepository
    ) { }

    find(params: Partial<IQueryData>): Promise<IPagination<IEvents>> {
        return this.eventsRepository.find({
            ...params,
            join: this.defaultJoin
        });
    }

    findById(id: string | number): Promise<IEvents> {
        return this.eventsRepository.findById(id, this.defaultJoin);
    }

    createBatch(data: IEvents[]): Promise<void> {
        return this.eventsRepository.batchCreate(data);
    }
}