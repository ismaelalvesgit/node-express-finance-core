import { investmentService } from "../services";
import { InternalServer, NotFound } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { delKeysCache } from "../utils/cache";

const clearCachePath = ['investment', 'transaction', 'dividends']

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const data = await investmentService.findOne(where);
    if(!data){
        throw new NotFound({code: "Investment"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query.search;
    const sortBy = req.query.sortBy;
    const orderBy = req.query.orderBy;
    const limit = req.query.limit;
    const data = await investmentService.findAll(where, sortBy, orderBy, limit);
    res.json(data);
});

export const findAvailable = catchAsync(async (req, res) =>{
    const search = req.query.search;
    const category = req.query.category;
    const data = await investmentService.findAvailable(search, category);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    investmentService.create(data).then((result)=>{
        if(result.length){
           delKeysCache(clearCachePath);
            res.status(StatusCodes.CREATED).json(req.__("Investment.create"));
        }else{
            throw new InternalServer({code: "Investment"});
        }
    }).catch(next);
});

export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const id = req.params.id;
    investmentService.update({id}, data).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Investment"});
        }
       delKeysCache(clearCachePath);
        res.status(StatusCodes.OK).json(req.__("Investment.update"));
    }).catch(next);
});

export const del = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    investmentService.del({id}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Investment"});
        }
       delKeysCache(clearCachePath);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});