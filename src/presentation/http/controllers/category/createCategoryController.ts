import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ICategoryService } from "@domain/category/types/ICategoryService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class CreateCategoryController implements IBaseController {

    constructor(
        @inject(tokens.CategoryService)
        private categoryService: ICategoryService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.categoryService.create(req.body);
        res.sendStatus(StatusCodes.CREATED);
    }
}