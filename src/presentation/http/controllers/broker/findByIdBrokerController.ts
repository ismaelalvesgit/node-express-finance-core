import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBrokerService } from "@domain/broker/types/IBrokerService";

@injectable()
export default class FindByIdBrokerController implements IBaseController {

    constructor(
        @inject(tokens.BrokerService)
        private brokerService: IBrokerService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.brokerService.findById(id);
        res.json(data);
    }
}