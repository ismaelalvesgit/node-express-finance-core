import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBcbService } from "@domain/bcb/types/IBcbService";
import { EIndexPeriod, EIndexType } from "@domain/investment/types/IInvest";

@injectable()
export default class IndexV2BcbController implements IBaseController {

    constructor(
        @inject(tokens.BcbService)
        private bcbService: IBcbService,
    ) { }

    async handler(req: Request, res: Response) {
        const body = await this.bcbService.indexV2({
            period: EIndexPeriod[req.query.period as string],
            type: EIndexType[req.query.type as string]
        });
        res.json(body);
    }
}