import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdDividendsController from "@presentation/http/controllers/dividends/findByIdDividendsController";
import FindAllDividendsController from "@presentation/http/controllers/dividends/findAllDividendsController";
import CreateDividendsController from "@presentation/http/controllers/dividends/createDividendsController";
import DeleteDividendsController from "@presentation/http/controllers/dividends/deleteDividendsController";
import UpdateDividendsController from "@presentation/http/controllers/dividends/updateDividendsController";
import { validator } from "@presentation/http/middlewares/validator";
import { autoCreateDividendsSchema, autoPaidDividendsSchema, createDividendsSchema } from "@presentation/http/schemas/dividends";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";
import PaidDividendsController from "@presentation/http/controllers/dividends/paidDividendsController";
import AutoCreateDividendsController from "@presentation/http/controllers/dividends/autoCreateDividendsController";

@injectable()
export class DividendsRouter implements IRouter {
    private router: Router;
    private prefix = "/dividends";

    constructor(
        @inject(tokens.FindByIdDividendsController)
        private findByIdDividendsController: FindByIdDividendsController,
  
        @inject(tokens.FindAllDividendsController)
        private findAllDividendsController: FindAllDividendsController,

        @inject(tokens.CreateDividendsController)
        private createDividendsController: CreateDividendsController,

        @inject(tokens.PaidDividendsController)
        private paidDividendsController: PaidDividendsController,

        @inject(tokens.AutoCreateDividendsController)
        private autoCreateDividendsController: AutoCreateDividendsController,

        @inject(tokens.DeleteDividendsController)
        private deleteDividendsController: DeleteDividendsController,

        @inject(tokens.UpdateDividendsController)
        private updateDividendsController: UpdateDividendsController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "dividends"}), catchAsync(this.findAllDividendsController))
            .post(validator(createDividendsSchema), catchAsync(this.createDividendsController));
            
        this.router.route(`${this.prefix}/autoCreate`)
            .post(validator(autoCreateDividendsSchema), catchAsync(this.autoCreateDividendsController));

        this.router.route(`${this.prefix}/autoPaid`)
            .post(validator(autoPaidDividendsSchema), catchAsync(this.paidDividendsController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "dividends"}), catchAsync(this.findByIdDividendsController))
            .put(validator(createDividendsSchema), catchAsync(this.updateDividendsController))
            .delete(catchAsync(this.deleteDividendsController));
        
        return this.router;
    }
}