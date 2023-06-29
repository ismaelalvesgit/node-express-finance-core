import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const requestId = (req: Request, _: Response, next: NextFunction) => {
    const requestId = (req.query.requestId || req.headers["requestId"] || uuidv4()) as string;
    req.requestId = requestId;
    req.headers["requestId"] = requestId;
    return next();
};

export default requestId;