import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";

@injectable()
export default class UpdateInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.investmentService.update(id, req.body);
        res.status(StatusCodes.OK).json(req.__("Investment.update"));
    }
}