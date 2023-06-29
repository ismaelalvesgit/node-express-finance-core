import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import HealthcheckController from "@presentation/http/controllers/system/healthcheckController";

@injectable()
export class SystemRouter implements IRouter {
    private router: Router;
    private prefix = "/system";

    constructor(
        @inject(tokens.HealthcheckController)
        private healthcheckController: HealthcheckController,
    ) {
        this.router = Router();
    }

    setup() {
        this.router.get(`${this.prefix}/healthcheck`, catchAsync(this.healthcheckController));   
        
        return this.router;
    }
}