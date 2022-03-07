import joi from "@hapi/joi";
import categoryType from "../enum/categoryType";

export const findAllInvestmentSchema = joi.object({
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

export const findAvailableInvestmentSchema = joi.object({
    query: joi.object({
        search: joi.string().required(),
        category: joi.string().valid(categoryType.ACAO, categoryType.CRIPTOMOEDA).required(),
    }),
});

export const createInvestmentSchema = joi.object({
    body: joi.object({
        categoryId: joi.number().integer().unsafe().required(),
        name: joi.string().required().uppercase(),
        longName: joi.string(),
        sector: joi.string().required().uppercase(),
    }).required(),
});

export const updateInvestmentSchema = joi.object({
    body: joi.object({
        categoryId: joi.number().integer().unsafe(),
        longName: joi.string(),
        sector: joi.string().uppercase(),
    }).min(1),
});