import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IProductService } from "@domain/product/types/IProductService";

@injectable()
export default class FindAllProductController implements IBaseController {

    constructor(
        @inject(tokens.ProductService)
        private productService: IProductService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Array.isArray(req.query.filterBy) 
            ? req.query.filterBy : 
            req.query.filterBy != undefined ? 
            [req.query.filterBy] : 
            undefined;
        const data = await this.productService.find({
            ...req.query,
            filterBy: filterBy as string[] 
        });
        res.json(data);
    }
}