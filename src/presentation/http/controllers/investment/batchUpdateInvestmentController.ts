import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";

@injectable()
export default class BatchUpdateInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        const { notify } = req.query;
        const investments = await this.investmentService.batchUpdate(req.body);
        if(notify){
            investments.forEach((investment)=>{
                req.io.emit("/update-investment", investment);
            });
        }
        res.status(StatusCodes.OK).json(req.__("Investment.update"));
    }
}