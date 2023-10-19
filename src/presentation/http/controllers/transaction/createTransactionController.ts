import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ITransactionService } from "@domain/transaction/types/ITransactionService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class CreateTransactionController implements IBaseController {

    constructor(
        @inject(tokens.TransactionService)
        private transactionService: ITransactionService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.transactionService.create({
            ...req.body,
            investment: {
                name: req.body.investment
            }
        });
        res.status(StatusCodes.CREATED).json(req.__("Transaction.create"));
    }
}