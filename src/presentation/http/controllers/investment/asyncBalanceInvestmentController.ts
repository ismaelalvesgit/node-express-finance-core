import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";

@injectable()
export default class SyncBalanceInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.investmentService.syncBalance();
        res.status(StatusCodes.OK).json(req.__("Investment.update"));
    }
}