import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class AutoCreateDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.dividendsService.autoCreate(req.body);
        res.status(StatusCodes.OK).json(req.__("Dividends.create"));
    }
}