import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IDividendsService } from "@domain/dividends/types/IDividendsService";
import Common from "@helpers/Common";

@injectable()
export default class FindAllDividendsController implements IBaseController {

    constructor(
        @inject(tokens.DividendsService)
        private dividendsService: IDividendsService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Common.getFilterBy(req);
        const data = await this.dividendsService.find({
            ...req.query,
            filterBy
        });
        res.json(data);
    }
}