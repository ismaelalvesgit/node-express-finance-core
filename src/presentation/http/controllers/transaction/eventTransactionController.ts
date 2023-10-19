import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ITransactionService } from "@domain/transaction/types/ITransactionService";
import { StatusCodes } from "http-status-codes";
import { ETransactionEventDirection } from "@domain/transaction/types/ITransaction";

@injectable()
export default class EventTransactionController implements IBaseController {

    constructor(
        @inject(tokens.TransactionService)
        private transactionService: ITransactionService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.transactionService.event(req.body);
        const i18n = req.body.direction === ETransactionEventDirection.GROUPING ? 
            "Transaction.grouping" : 
            "Transaction.split";
        res.status(StatusCodes.OK).json(req.__(i18n));
    }
}