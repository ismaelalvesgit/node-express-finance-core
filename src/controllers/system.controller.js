import catchAsync from "../utils/catchAsync";
import knex from "../db";

export const status = catchAsync(async (req, res, next) =>{
    knex.raw("select 1+1 as result").then(() =>{
        res.json("OK");
    }).catch(next);
});

