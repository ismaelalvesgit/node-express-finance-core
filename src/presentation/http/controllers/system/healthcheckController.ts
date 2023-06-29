import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { tokens } from "@di/tokens";
import { ISystemService } from "@domain/system/types/ISystemService";

@injectable()
export default class HealthcheckController implements IBaseController {

    constructor(
        @inject(tokens.SystemService)
        private systemService: ISystemService
    ) { }

    async handler(_: Request, res: Response) {
        await this.systemService.healthcheck();
        res.sendStatus(StatusCodes.OK);
    }
}