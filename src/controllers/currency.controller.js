import { StatusCodes } from "http-status-codes";
import { currencyApiService, currencyService } from "../services";
import catchAsync from "../utils/catchAsync";
import { InternalServer, NotFound } from "../utils/erro";

export const find = catchAsync(async (req, res) =>{
    const data = await currencyService.findAll();
    res.json(data);
});

export const available = catchAsync(async (req, res) =>{
    const data = await currencyApiService.getAvailable();
    res.json(data);
});

export const code = catchAsync(async (req, res) =>{
    const data = await currencyApiService.getId();
    res.json(data);
});

export const last = catchAsync(async (req, res) =>{
    const currency = await currencyService.findAll();
    const data = await currencyApiService.getCurrency(currency.map(e => e.code));
    res.json(data);
});

export const create = catchAsync(async(req, res, next) =>{
    const data = req.body;
    await currencyApiService.getCurrency([data.code]);
    currencyService.create(data).then(async(result)=>{
        if(result.length){
            await currencyService.updateCache();
            res.status(StatusCodes.CREATED).json(req.__("Currency.create"));
        }else{
            throw new InternalServer({code: "Currency"});
        }
    }).catch(next);
});

export const del = catchAsync(async (req, res, next) =>{
    const id = req.params.id;
    currencyService.del({id}).then(async(result)=>{
        if(result != 1){
            throw new NotFound({code: "Currency"});
        }
        await currencyService.updateCache();
        res.sendStatus(StatusCodes.NO_CONTENT);
    }).catch(next);
});