import joi from "@hapi/joi";
import transactionType from "../enum/transactionType";

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
        investment: joi.string().required(),
        broker: joi.string().required(),
        category: joi.string().required(),
        type: joi.string().valid(...Object.keys(transactionType)).required(),
        negotiationDate: joi.date().required(),
        dueDate: joi.when("type", {
            is: transactionType.RENT, then: joi.date().required()
        }).when("type", {
            not: transactionType.RENT, then: joi.date().optional()
        }),
        brokerage: joi.number().integer().unsafe().positive().min(1),
        fees: joi.number().integer().unsafe().positive().min(1),
        taxes: joi.number().integer().unsafe().positive().min(1),
        qnt: joi.number().integer().unsafe().positive().min(1).required(),
        price: joi.number().integer().unsafe().positive().min(1).required(),
    }).required(),
});