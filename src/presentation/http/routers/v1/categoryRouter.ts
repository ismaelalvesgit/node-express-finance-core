import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdCategoryController from "@presentation/http/controllers/category/findByIdCategoryController";
import FindAllCategoryController from "@presentation/http/controllers/category/findAllCategoryController";
import CreateCategoryController from "@presentation/http/controllers/category/createCategoryController";
import DeleteCategoryController from "@presentation/http/controllers/category/deleteCategoryController";
import UpdateCategoryController from "@presentation/http/controllers/category/updateCategoryController";
import { validator } from "@presentation/http/middlewares/validator";
import { createCategorySchema, updateCategorySchema } from "@presentation/http/schemas/category";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";
import CreateAsyncCategoryController from "@presentation/http/controllers/category/createAsyncCategoryController";

@injectable()
export class CategoryRouter implements IRouter {
    private router: Router;
    private prefix = "/category";

    constructor(
        @inject(tokens.FindByIdCategoryController)
        private findByIdCategoryController: FindByIdCategoryController,
  
        @inject(tokens.FindAllCategoryController)
        private findAllCategoryController: FindAllCategoryController,

        @inject(tokens.CreateCategoryController)
        private createCategoryController: CreateCategoryController,

        @inject(tokens.CreateAsyncCategoryController)
        private createAsyncCategoryController: CreateAsyncCategoryController,

        @inject(tokens.DeleteCategoryController)
        private deleteCategoryController: DeleteCategoryController,

        @inject(tokens.UpdateCategoryController)
        private updateCategoryController: UpdateCategoryController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "category"}), catchAsync(this.findAllCategoryController))
            .post(validator(createCategorySchema), catchAsync(this.createCategoryController));
            
        this.router.route(`${this.prefix}/async`)
            .post(validator(createCategorySchema), catchAsync(this.createAsyncCategoryController));

        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "category"}), catchAsync(this.findByIdCategoryController))
            .put(validator(updateCategorySchema), catchAsync(this.updateCategoryController))
            .delete(catchAsync(this.deleteCategoryController));
        
        return this.router;
    }
}