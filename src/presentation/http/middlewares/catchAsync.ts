import { NextFunction, Request, Response } from "express";
import { IBaseController } from "../types/IRouter";

const catchAsync = (fn: IBaseController) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn.handler(req, res, next)).catch((err) => next(err));
};

export default catchAsync;