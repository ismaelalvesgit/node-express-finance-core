import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdInvestmentController from "@presentation/http/controllers/investment/findByIdInvestmentController";
import FindAllInvestmentController from "@presentation/http/controllers/investment/findAllInvestmentController";
import CreateInvestmentController from "@presentation/http/controllers/investment/createInvestmentController";
import DeleteInvestmentController from "@presentation/http/controllers/investment/deleteInvestmentController";
import UpdateInvestmentController from "@presentation/http/controllers/investment/updateInvestmentController";
import { validator } from "@presentation/http/middlewares/validator";
import { batchInvestmentSchema, updateInvestmentSchema, createInvestmentSchema } from "@presentation/http/schemas/investment";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";
import BatchUpdateInvestmentController from "@presentation/http/controllers/investment/batchUpdateInvestmentController";
import SyncBalanceInvestmentController from "@presentation/http/controllers/investment/asyncBalanceInvestmentController";

@injectable()
export class InvestmentRouter implements IRouter {
    private router: Router;
    private prefix = "/investment";

    constructor(
        @inject(tokens.FindByIdInvestmentController)
        private findByIdInvestmentController: FindByIdInvestmentController,
  
        @inject(tokens.FindAllInvestmentController)
        private findAllInvestmentController: FindAllInvestmentController,

        @inject(tokens.CreateInvestmentController)
        private createInvestmentController: CreateInvestmentController,

        @inject(tokens.DeleteInvestmentController)
        private deleteInvestmentController: DeleteInvestmentController,

        @inject(tokens.UpdateInvestmentController)
        private updateInvestmentController: UpdateInvestmentController,

        @inject(tokens.BatchUpdateInvestmentController)
        private batchUpdateInvestmentController: BatchUpdateInvestmentController,

        @inject(tokens.SyncBalanceInvestmentController)
        private syncBalanceInvestmentController: SyncBalanceInvestmentController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "investment"}), catchAsync(this.findAllInvestmentController))
            .post(validator(createInvestmentSchema), catchAsync(this.createInvestmentController));
            
        this.router.route(`${this.prefix}/syncBalance`)
            .put(catchAsync(this.syncBalanceInvestmentController));

        this.router.route(`${this.prefix}/batch`)
            .put(validator(batchInvestmentSchema), catchAsync(this.batchUpdateInvestmentController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "investment"}), catchAsync(this.findByIdInvestmentController))
            .put(validator(updateInvestmentSchema), catchAsync(this.updateInvestmentController))
            .delete(catchAsync(this.deleteInvestmentController));
        
        return this.router;
    }
}