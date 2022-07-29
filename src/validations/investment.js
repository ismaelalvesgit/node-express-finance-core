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

export const updateInvestmentSchema = joi.object({
    body: joi.object({
        name: joi.string().uppercase(),
        longName: joi.string(),
        logoUrl: joi.string(),
        sector: joi.string().uppercase(),
        balance: joi.number(),
        currency: joi.string().uppercase(),
        priceDay: joi.number(),
        priceDayHigh: joi.number(),
        priceDayLow: joi.number(),
        changePercentDay: joi.number(),
        variationDay: joi.number(),
        variationDayTotal: joi.number(),
        changePercentTotal: joi.number(),
        variationTotal: joi.number(),
        volumeDay: joi.number(),
        previousClosePrice: joi.number(),
    }).min(1),
});

export const batchInvestmentSchema = joi.object({
    query: joi.object({
        notify: joi.bool().default(true)
    }),
    body: joi.array().items(
        joi.object({
            id: joi.number().integer().unsafe().required(),
            name: joi.string().uppercase(),
            longName: joi.string(),
            logoUrl: joi.string(),
            sector: joi.string().uppercase(),
            balance: joi.number(),
            currency: joi.string().uppercase(),
            priceDay: joi.number(),
            priceDayHigh: joi.number(),
            priceDayLow: joi.number(),
            changePercentDay: joi.number(),
            variationDay: joi.number(),
            variationDayTotal: joi.number(),
            changePercentTotal: joi.number(),
            variationTotal: joi.number(),
            volumeDay: joi.number(),
            previousClosePrice: joi.number(),
        }).min(1)
    ).min(1),
});