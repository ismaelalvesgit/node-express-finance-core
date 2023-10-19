import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdBrokerController from "@presentation/http/controllers/broker/findByIdBrokerController";
import FindAllBrokerController from "@presentation/http/controllers/broker/findAllBrokerController";
import CreateBrokerController from "@presentation/http/controllers/broker/createBrokerController";
import DeleteBrokerController from "@presentation/http/controllers/broker/deleteBrokerController";
import UpdateBrokerController from "@presentation/http/controllers/broker/updateBrokerController";
import { validator } from "@presentation/http/middlewares/validator";
import { brokerSchema } from "@presentation/http/schemas/broker";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";

@injectable()
export class BrokerRouter implements IRouter {
    private router: Router;
    private prefix = "/broker";

    constructor(
        @inject(tokens.FindByIdBrokerController)
        private findByIdBrokerController: FindByIdBrokerController,
  
        @inject(tokens.FindAllBrokerController)
        private findAllBrokerController: FindAllBrokerController,

        @inject(tokens.CreateBrokerController)
        private createBrokerController: CreateBrokerController,

        @inject(tokens.DeleteBrokerController)
        private deleteBrokerController: DeleteBrokerController,

        @inject(tokens.UpdateBrokerController)
        private updateBrokerController: UpdateBrokerController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "broker"}), catchAsync(this.findAllBrokerController))
            .post(validator(brokerSchema), catchAsync(this.createBrokerController));
            
        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "broker"}), catchAsync(this.findByIdBrokerController))
            .put(validator(brokerSchema), catchAsync(this.updateBrokerController))
            .delete(catchAsync(this.deleteBrokerController));
        
        return this.router;
    }
}