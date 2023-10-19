import { inject, injectable } from "tsyringe";
import { IBrokerService } from "../types/IBrokerService";
import { IQueryData, IPagination } from "@helpers/ICommon";
import { IBroker } from "../types/IBroker";
import { tokens } from "@di/tokens";
import { IBrokerRepository } from "../types/IBrokerRepository";

@injectable()
export default class BrokerService implements IBrokerService {

    constructor(
        @inject(tokens.BrokerRepository)
        private brokerRepository: IBrokerRepository,
    ) { }

    find(params: Partial<IQueryData>): Promise<IPagination<IBroker>> {
        return this.brokerRepository.find(params);
    }

    findById(id: string | number): Promise<IBroker> {
        return this.brokerRepository.findById(id);
    }

    create(data: IBroker): Promise<void> {
        return this.brokerRepository.create(data);
    }

    update(id: string | number, data: IBroker): Promise<void> {
        return this.brokerRepository.update(id, data);
    }

    delete(id: string | number): Promise<void> {
        return this.brokerRepository.delete(id);
    }

}
