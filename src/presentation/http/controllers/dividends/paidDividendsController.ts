import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class PaidDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.dividendsService.paid(req.body.dueDate);
        res.status(StatusCodes.OK).json(req.__("Dividends.update"));
    }
}