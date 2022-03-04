import { brokerService } from "../services";
import { InternalServer, NotFound } from "../utils/erro";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { delCache } from "../utils/cache";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const data = await brokerService.findOne(where);
    if(!data){
        throw new NotFound({code: "Broker"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query.search;
    const sortBy = req.query.sortBy;
    const orderBy = req.query.orderBy;
    const limit = req.query.limit;
    const data = await brokerService.findAll(where, sortBy, orderBy, limit);
    res.json(data);
});

export const create = catchAsync((req, res, next) =>{
    const data = req.body;
    brokerService.create(data).then((result)=>{
        if(result.length){
            delCache(req);
            res.status(StatusCodes.CREATED).json(req.__("Broker.create"));
        }else{
            throw new InternalServer({code: "Broker"});
        }
    }).catch(next);
});

export const update = catchAsync((req, res, next) =>{
    const data = req.body;
    const id = req.params.id;
    brokerService.update({id}, data).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Broker"});
        }
        delCache(req);
        res.status(StatusCodes.OK).json(req.__("Broker.update"));
    }).catch(next);
});

export const del = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    brokerService.del({id}).then((result)=>{
        if(result != 1){
            throw new NotFound({code: "Broker"});
        }
        delCache(req);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});