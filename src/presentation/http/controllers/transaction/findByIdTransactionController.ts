import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ITransactionService } from "@domain/transaction/types/ITransactionService";

@injectable()
export default class FindByIdTransactionController implements IBaseController {

    constructor(
        @inject(tokens.TransactionService)
        private transactionService: ITransactionService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.transactionService.findById(id);
        res.json(data);
    }
}