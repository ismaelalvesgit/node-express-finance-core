import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IProductService } from "@domain/product/types/IProductService";

@injectable()
export default class FindByIdProductController implements IBaseController {

    constructor(
        @inject(tokens.ProductService)
        private productService: IProductService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.productService.findById(id);
        res.json(data);
    }
}