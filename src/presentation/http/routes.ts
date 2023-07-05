import { Config } from "@config/config";
import { tokens } from "@di/tokens";
import { Router } from "express";
import { inject, injectable } from "tsyringe";
import YAML from "yamljs";
import swagger from "swagger-ui-express";
import path from "path";
import { CategoryRouter } from "./routers/v1/categoryRouter";
import { ProductRouter } from "./routers/v1/productRouter";
import { SystemRouter } from "./routers/v1/systemRouter";

@injectable()
export default class Routes { 
    
    constructor(
        @inject(tokens.Config)
        private config: Config,
  
        @inject(tokens.CategoryRouter)
        private categoryRouter: CategoryRouter,

        @inject(tokens.ProductRouter)
        private productRouter: ProductRouter,

        @inject(tokens.SystemRouter)
        private systemRouter: SystemRouter
    ) {}

    public setupRouter(router: Router) {
        const { docs: { enabled } } = this.config.get();
        if(enabled) {
            const swaggerDocument = YAML.load(
                path.resolve(__dirname, "..", "..", "..", "docs", "swagger.yml")
            );
            router.use("/v1/docs", swagger.serve, swagger.setup(swaggerDocument));
        }

        router.get("/favicon.ico", (_, res)=>{
            res.sendStatus(200);
        });
        
        router.use("/v1", this.categoryRouter.setup()); 
        router.use("/v1", this.productRouter.setup()); 
        router.use("/v1", this.systemRouter.setup()); 

        router.get("/", (_, res) =>{
            res.render("index", {url: `http://localhost:${this.config.get().port}`});
        });

        // router.all(
        //     "*",
        //     (req, res) => {
        //       res.status(501).json({message: req.__("ServiceUnavailable.router")});
        //     },
        // );
    }
}