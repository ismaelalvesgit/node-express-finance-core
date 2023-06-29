import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ICategoryService } from "@domain/category/types/ICategoryService";

@injectable()
export default class FindByIdCategoryController implements IBaseController {

    constructor(
        @inject(tokens.CategoryService)
        private categoryService: ICategoryService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.categoryService.findById(id);
        res.json(data);
    }
}