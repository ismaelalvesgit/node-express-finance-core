import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IBcbService } from "@domain/bcb/types/IBcbService";

@injectable()
export default class NewsBcbController implements IBaseController {

    constructor(
        @inject(tokens.BcbService)
        private bcbService: IBcbService,
    ) { }

    async handler(_: Request, res: Response) {
        const body = await this.bcbService.news();
        res.json(body);
    }
}
