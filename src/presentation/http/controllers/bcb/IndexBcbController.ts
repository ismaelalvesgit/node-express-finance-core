import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBcbService } from "@domain/bcb/types/IBcbService";
import { EBcbIndexType } from "@domain/bcb/types/IBcb";

@injectable()
export default class IndexBcbController implements IBaseController {

    constructor(
        @inject(tokens.BcbService)
        private bcbService: IBcbService,
    ) { }

    async handler(req: Request, res: Response) {
        const body = await this.bcbService.index({
            ...req.query,
            type: EBcbIndexType[req.query.type as string]
        });
        res.json(body);
    }
}
