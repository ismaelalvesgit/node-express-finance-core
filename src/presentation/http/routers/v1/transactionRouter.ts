import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdTransactionController from "@presentation/http/controllers/transaction/findByIdTransactionController";
import FindAllTransactionController from "@presentation/http/controllers/transaction/findAllTransactionController";
import CreateTransactionController from "@presentation/http/controllers/transaction/createTransactionController";
import DeleteTransactionController from "@presentation/http/controllers/transaction/deleteTransactionController";
import UpdateTransactionController from "@presentation/http/controllers/transaction/updateTransactionController";
import { validator } from "@presentation/http/middlewares/validator";
import { transactionSchema, eventTransactionSchema } from "@presentation/http/schemas/transaction";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";
import EventTransactionController from "@presentation/http/controllers/transaction/eventTransactionController";

@injectable()
export class TransactionRouter implements IRouter {
    private router: Router;
    private prefix = "/transaction";

    constructor(
        @inject(tokens.FindByIdTransactionController)
        private findByIdTransactionController: FindByIdTransactionController,
  
        @inject(tokens.FindAllTransactionController)
        private findAllTransactionController: FindAllTransactionController,

        @inject(tokens.CreateTransactionController)
        private createTransactionController: CreateTransactionController,

        @inject(tokens.EventTransactionController)
        private eventTransactionController: EventTransactionController,

        @inject(tokens.DeleteTransactionController)
        private deleteTransactionController: DeleteTransactionController,

        @inject(tokens.UpdateTransactionController)
        private updateTransactionController: UpdateTransactionController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "transaction"}), catchAsync(this.findAllTransactionController))
            .post(validator(transactionSchema), catchAsync(this.createTransactionController));
            
        this.router.route(`${this.prefix}/event`)
            .put(validator(eventTransactionSchema), catchAsync(this.eventTransactionController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "transaction"}), catchAsync(this.findByIdTransactionController))
            .put(validator(transactionSchema), catchAsync(this.updateTransactionController))
            .delete(catchAsync(this.deleteTransactionController));
        
        return this.router;
    }
}