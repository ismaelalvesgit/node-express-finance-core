import { NextFunction, Request, Response } from "express";

const changeLocale = (req: Request, res: Response, next: NextFunction)=>{
    const locale = (req.query.lang || req.header("accept-language")) as string;
    if(locale){
        req.setLocale(locale);
        res.setLocale(locale);
    }
    next();
};

export default changeLocale;