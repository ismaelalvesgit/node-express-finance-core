import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { ITransactionService } from "@domain/transaction/types/ITransactionService";

@injectable()
export default class DeleteTransactionController implements IBaseController {

    constructor(
        @inject(tokens.TransactionService)
        private transactionService: ITransactionService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.transactionService.delete(id);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}