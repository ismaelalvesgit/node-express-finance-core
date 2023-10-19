import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBrokerService } from "@domain/broker/types/IBrokerService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class CreateBrokerController implements IBaseController {

    constructor(
        @inject(tokens.BrokerService)
        private brokerService: IBrokerService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.brokerService.create(req.body);
        res.status(StatusCodes.CREATED).json(req.__("Broker.create"));
    }
}