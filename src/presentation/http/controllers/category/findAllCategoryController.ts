import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { ICategoryService } from "@domain/category/types/ICategoryService";

@injectable()
export default class FindAllCategoryController implements IBaseController {

    constructor(
        @inject(tokens.CategoryService)
        private categoryService: ICategoryService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Array.isArray(req.query.filterBy) 
            ? req.query.filterBy : 
            req.query.filterBy != undefined ? 
            [req.query.filterBy] : 
            undefined;
        const data = await this.categoryService.find({
            ...req.query,
            filterBy: filterBy as string[] 
        });
        res.json(data);
    }
}