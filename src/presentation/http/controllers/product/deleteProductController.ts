import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { StatusCodes } from "http-status-codes";
import { IProductService } from "@domain/product/types/IProductService";

@injectable()
export default class DeleteProductController implements IBaseController {

    constructor(
        @inject(tokens.ProductService)
        private productService: IProductService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        await this.productService.delete(id);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
}