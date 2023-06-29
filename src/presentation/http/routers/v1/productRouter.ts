import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import FindByIdProductController from "@presentation/http/controllers/product/findByIdProductController";
import FindAllProductController from "@presentation/http/controllers/product/findAllProductController";
import CreateProductController from "@presentation/http/controllers/product/createProductController";
import DeleteProductController from "@presentation/http/controllers/product/deleteProductController";
import UpdateProductController from "@presentation/http/controllers/product/updateProductController";
import { validator } from "@presentation/http/middlewares/validator";
import { createProductSchema, updateProductSchema } from "@presentation/http/schemas/product";
import { queryDataSchema } from "@presentation/http/schemas/common";
import cacheHandler from "@presentation/http/middlewares/cache";
import CreateAsyncProductController from "@presentation/http/controllers/product/createAsyncProductController";

@injectable()
export class ProductRouter implements IRouter {
    private router: Router;
    private prefix = "/product";

    constructor(
        @inject(tokens.FindByIdProductController)
        private findByIdProductController: FindByIdProductController,
  
        @inject(tokens.FindAllProductController)
        private findAllProductController: FindAllProductController,

        @inject(tokens.CreateProductController)
        private createProductController: CreateProductController,

        @inject(tokens.CreateAsyncProductController)
        private createAsyncProductController: CreateAsyncProductController,

        @inject(tokens.DeleteProductController)
        private deleteProductController: DeleteProductController,

        @inject(tokens.UpdateProductController)
        private updateProductController: UpdateProductController
    ) {
        this.router = Router();
    }

    setup() {
        this.router.route(this.prefix)
            .get(validator(queryDataSchema), cacheHandler({path: "product"}), catchAsync(this.findAllProductController))
            .post(validator(createProductSchema), catchAsync(this.createProductController));

            this.router.route(`${this.prefix}/async`)
            .post(validator(createProductSchema), catchAsync(this.createAsyncProductController));
            
        this.router.route(`${this.prefix}/:id`)
            .get(cacheHandler({path: "product"}), catchAsync(this.findByIdProductController))
            .put(validator(updateProductSchema), catchAsync(this.updateProductController))
            .delete(catchAsync(this.deleteProductController));
        
        return this.router;
    }
}