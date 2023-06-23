import joi from "@hapi/joi";
import dividendsStatus from "../enum/dividendsStatus";
import dividendsType from "../enum/dividendsType";

export const findAllDividendsSchema = joi.object({
    query: joi.object({
        search: joi.string().custom((value, helpers)=>{
            try {
                const test = JSON.parse(value);
                if(Object.keys(test).length > 1){
                    return helpers.message("Must have one attribute");
                }
                return value;
            } catch (error) {
                return helpers.message("Only object type");
            }
        }),
        sortBy: joi.string(),
        orderBy: joi.string().valid("asc", "desc"),
        limit: joi.number().integer().positive().min(1),
    }),
});

export const createDividendsSchema = joi.object({
    body: joi.object({
        investmentId: joi.number().positive().min(1).required(),
        brokerId: joi.number().positive().min(1).required(),
        status: joi.string().valid(...Object.keys(dividendsStatus)).default(dividendsStatus.PROVISIONED),
        type: joi.string().valid(...Object.keys(dividendsType)).required(),
        dueDate: joi.date().required(),
        dateBasis: joi.date().required(),
        qnt: joi.number().unsafe().positive().min(1).required(),
        price: joi.number().unsafe().positive().required(),
        fees: joi.number().unsafe().min(0),
        currency: joi.string(),
    }).required(),
});

export const autoCreateDividendsSchema = joi.object({
    body: joi.array().items(
        joi.object({
            investmentId: joi.number().unsafe().positive().min(1).required(),
            type: joi.string().valid(...Object.keys(dividendsType)).required(),
            dueDate: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
            dateBasis: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
            price: joi.number().unsafe().positive().required(),
            fees: joi.number().unsafe().min(0),
        }).required()
    ).min(1),
});

export const autoPaidDividendsSchema = joi.object({
    body: joi.object({
        dueDate: joi.date().required()
    }).min(1)
});