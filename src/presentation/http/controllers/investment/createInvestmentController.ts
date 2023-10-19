import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class CreateInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.investmentService.create(req.body);
        res.status(StatusCodes.CREATED).json(req.__("Investment.create"));
    }
}