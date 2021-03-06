import joi from "@hapi/joi";
import transactionType from "../enum/transactionType";
import categoryType from "../enum/categoryType";

export const findAllTransactionSchema = joi.object({
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

export const createTransactionSchema = joi.object({
    body: joi.object({
        investment: joi.string().required().uppercase(),
        broker: joi.string().required().uppercase(),
        category: joi.string().valid(...Object.values(categoryType)).required(),
        type: joi.string().valid(...Object.keys(transactionType)).required(),
        negotiationDate: joi.date().required(),
        brokerage: joi.number().unsafe().positive(),
        fees: joi.number().unsafe().positive(),
        taxes: joi.number().unsafe().positive(),
        qnt: joi.number().unsafe().positive().required(),
        price: joi.number().unsafe().positive().required(),
    }).required(),
});