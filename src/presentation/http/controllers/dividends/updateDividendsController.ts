import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";

@injectable()
export default class UpdateDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.dividendsService.update(id, req.body);
        res.status(StatusCodes.OK).json(req.__("Dividends.update"));
    }
}