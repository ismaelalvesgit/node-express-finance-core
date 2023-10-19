import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";
import Common from "@helpers/Common";

@injectable()
export default class FindAllInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Common.getFilterBy(req);
        const data = await this.investmentService.find({
            ...req.query,
            filterBy
        });
        res.json(data);
    }
}