import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ITransactionService } from "@domain/transaction/types/ITransactionService";
import Common from "@helpers/Common";

@injectable()
export default class FindAllTransactionController implements IBaseController {

    constructor(
        @inject(tokens.TransactionService)
        private transactionService: ITransactionService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Common.getFilterBy(req);
        const data = await this.transactionService.find({
            ...req.query,
            filterBy
        });
        res.json(data);
    }
}