import { eventsService } from "../services";
import { NotFound } from "../utils/erro";
import catchAsync from "../utils/catchAsync";

export const findOne = catchAsync(async (req, res) =>{
    const where = {id: req.params.id};
    const data = await eventsService.findOne(where);
    if(!data){
        throw new NotFound({code: "Events"});
    }
    res.json(data);
});

export const find = catchAsync(async (req, res) =>{
    const where = req.query.search;
    const sortBy = req.query.sortBy;
    const orderBy = req.query.orderBy;
    const limit = req.query.limit;
    const data = await eventsService.findAll(where, sortBy, orderBy, limit);
    res.json(data);
});
