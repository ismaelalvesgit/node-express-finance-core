import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IBrokerService } from "@domain/broker/types/IBrokerService";

@injectable()
export default class UpdateBrokerController implements IBaseController {

    constructor(
        @inject(tokens.BrokerService)
        private brokerService: IBrokerService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.brokerService.update(id, req.body);
        res.status(StatusCodes.OK).json(req.__("Broker.update"));
    }
}