import { dividendsService } from "../services";
import { InternalServer, NotFound } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { delCache } from "../utils/cache";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const data = await dividendsService.findOne(where);
    if(!data){
        throw new NotFound({code: "Dividends"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query.search;
    const sortBy = req.query.sortBy;
    const orderBy = req.query.orderBy;
    const limit = req.query.limit;
    const data = await dividendsService.findAll(where, sortBy, orderBy, limit);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    dividendsService.create(data).then((result)=>{
        if(result.length){
            delCache(req);
            res.status(StatusCodes.CREATED).json(req.__("Dividends.create"));
        }else{
            throw new InternalServer({code: "Dividends"});
        }
    }).catch(next);
});

export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const id = req.params.id;
    dividendsService.update({id}, data).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Dividends"});
        }
        delCache(req);
        res.status(StatusCodes.OK).json(req.__("Dividends.update"));
    }).catch(next);
});

export const autoCreate = catchAsync((req, res, next) =>{
    const data = req.body;
    dividendsService.autoCreate(data).then(()=>{
        delCache(req);
        res.status(StatusCodes.OK).json(req.__("Dividends.create"));
    }).catch(next);
});

export const autoPaid = catchAsync((req, res, next) =>{
    const { dueDate } = req.body;
    dividendsService.autoPaid(dueDate).then(()=>{
        delCache(req);
        res.status(StatusCodes.OK).json(req.__("Dividends.update"));
    }).catch(next);
});

export const del = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    dividendsService.del({id}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Dividends"});
        }
        delCache(req);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});