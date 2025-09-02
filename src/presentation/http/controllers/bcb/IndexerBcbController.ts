import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBcbService } from "@domain/bcb/types/IBcbService";
import { EIndexerPeriod, EIndexerType } from "@domain/investment/types/IInvest";

@injectable()
export default class IndexerBcbController implements IBaseController {

    constructor(
        @inject(tokens.BcbService)
        private bcbService: IBcbService,
    ) { }

    async handler(req: Request, res: Response) {
        const body = await this.bcbService.indexer({
            period: EIndexerPeriod[req.query.period as string],
            type: EIndexerType[req.query.type as string]
        });
        res.json(body);
    }
}
