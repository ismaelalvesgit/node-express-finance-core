import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";

@injectable()
export default class FindByIdDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.dividendsService.findById(id);
        res.json(data);
    }
}