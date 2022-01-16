import joi from "@hapi/joi";
import dividendsType from "../enum/dividendsType";

export const findAllDividendsTypeSchema = joi.object({
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

export const createDividendsTypeSchema = joi.object({
    body: joi.object({
        investmentId: joi.number().positive().min(1).required(),
        type: joi.string().valid(...Object.keys(dividendsType)).required(),
        dueDate: joi.date().required(),
        qnt: joi.number().integer().positive().min(1).required(),
        price: joi.number().integer().positive().min(1).required(),
    }).required(),
});