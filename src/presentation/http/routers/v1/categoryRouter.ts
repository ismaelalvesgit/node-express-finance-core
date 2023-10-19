import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdCategoryController from "@presentation/http/controllers/category/findByIdCategoryController";
import FindAllCategoryController from "@presentation/http/controllers/category/findAllCategoryController";
import { validator } from "@presentation/http/middlewares/validator";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";

@injectable()
export class CategoryRouter implements IRouter {
    private router: Router;
    private prefix = "/category";

    constructor(
        @inject(tokens.FindByIdCategoryController)
        private findByIdCategoryController: FindByIdCategoryController,
  
        @inject(tokens.FindAllCategoryController)
        private findAllCategoryController: FindAllCategoryController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "category", timeExp: 525600}), catchAsync(this.findAllCategoryController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "category", timeExp: 525600}), catchAsync(this.findByIdCategoryController));
        
        return this.router;
    }
}