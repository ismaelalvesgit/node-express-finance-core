import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IInvestmentService } from "@domain/investment/types/IInvestmentService";

@injectable()
export default class FindByIdInvestmentController implements IBaseController {

    constructor(
        @inject(tokens.InvestmentService)
        private investmentService: IInvestmentService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.investmentService.findById(id);
        res.json(data);
    }
}