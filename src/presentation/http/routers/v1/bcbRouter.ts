import { inject, injectable } from "tsyringe";
import { IRouter } from "@presentation/http/types/IRouter";
import { Router } from "express";
import catchAsync from "@middlewares/catchAsync";
import { tokens } from "@di/tokens";
import { validator } from "@presentation/http/middlewares/validator";
import IndexBcbController from "@presentation/http/controllers/bcb/IndexBcbController";
import { indexerSchema, indexSchema, indexV2Schema } from "@presentation/http/schemas/bcb";
import InflactionIndicatorBcbController from "@presentation/http/controllers/bcb/inflactionIndicatorBcbController";
import NewsBcbController from "@presentation/http/controllers/bcb/newsBcbController";
import IndexV2BcbController from "@presentation/http/controllers/bcb/IndexV2BcbController";
import IndexerBcbController from "@presentation/http/controllers/bcb/IndexerBcbController";

@injectable()
export class BcbRouter implements IRouter {
    private router: Router;
    private prefix = "/bcb";

    constructor(
        @inject(tokens.IndexBcbController)
        private indexBcbController: IndexBcbController,
        
        @inject(tokens.IndexerBcbController)
        private indexerBcbController: IndexerBcbController,
        
        @inject(tokens.IndexV2BcbController)
        private indexV2BcbController: IndexV2BcbController,
   
        @inject(tokens.InflactionIndicatorBcbController)
        private inflactionIndicatorBcbController: InflactionIndicatorBcbController,
        
        @inject(tokens.NewsBcbController)
        private newsBcbController: NewsBcbController,
    ) {
        this.router = Router();
    }

    setup() {    
        this.router.route(`${this.prefix}/indexV2`)
            .get(validator(indexV2Schema), catchAsync(this.indexV2BcbController));
        
        this.router.route(`${this.prefix}/index`)
            .get(validator(indexSchema), catchAsync(this.indexBcbController));
        
        this.router.route(`${this.prefix}/indexer`)
            .get(validator(indexerSchema), catchAsync(this.indexerBcbController));
        
        this.router.route(`${this.prefix}/inflactionIndicator`)
            .get(catchAsync(this.inflactionIndicatorBcbController));
    
        this.router.route(`${this.prefix}/news`)
            .get(catchAsync(this.newsBcbController));
        
        return this.router;
    }
}