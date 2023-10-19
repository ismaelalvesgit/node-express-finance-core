import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdEventsController from "@presentation/http/controllers/events/findByIdEventsController";
import FindAllEventsController from "@presentation/http/controllers/events/findAllEventsController";
import BatchCreateEventsController from "@presentation/http/controllers/events/batchCreateEventsController";
import { validator } from "@presentation/http/middlewares/validator";
import { batchEventsSchema } from "@presentation/http/schemas/events";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";

@injectable()
export class EventsRouter implements IRouter {
    private router: Router;
    private prefix = "/events";

    constructor(
        @inject(tokens.FindByIdEventsController)
        private findByIdEventsController: FindByIdEventsController,
  
        @inject(tokens.FindAllEventsController)
        private findAllEventsController: FindAllEventsController,

        @inject(tokens.BatchCreateEventsController)
        private batchCreateEventsController: BatchCreateEventsController,
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "events"}), catchAsync(this.findAllEventsController));
            
        this.router.route(`${this.prefix}/batch`)
            .post(validator(batchEventsSchema), catchAsync(this.batchCreateEventsController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "events"}), catchAsync(this.findByIdEventsController));
        
        return this.router;
    }
}