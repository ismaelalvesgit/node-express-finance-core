import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";

@injectable()
export default class DeleteDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.dividendsService.delete(id);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}