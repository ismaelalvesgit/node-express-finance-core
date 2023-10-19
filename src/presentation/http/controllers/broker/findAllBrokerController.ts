import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBrokerService } from "@domain/broker/types/IBrokerService";
import Common from "@helpers/Common";

@injectable()
export default class FindAllBrokerController implements IBaseController {

    constructor(
        @inject(tokens.BrokerService)
        private brokerService: IBrokerService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Common.getFilterBy(req);
        const data = await this.brokerService.find({
            ...req.query,
            filterBy
        });
        res.json(data);
    }
}