import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IProductService } from "@domain/product/types/IProductService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class CreateProductController implements IBaseController {

    constructor(
        @inject(tokens.ProductService)
        private productService: IProductService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.productService.create(req.body);
        res.sendStatus(StatusCodes.CREATED);
    }
}