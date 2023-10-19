import joi from "joi";

export const createInvestmentSchema = joi.object({
    body: joi.object({
        name: joi.string().uppercase().required(),
        categoryId: joi.number().min(1).required(),
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

export const updateInvestmentSchema = joi.object({
    body: joi.object({
        name: joi.string().uppercase(),
        longName: joi.string(),
        logoUrl: joi.string(),
        sector: joi.string().uppercase(),
        balance: joi.number(),
        currency: joi.string().uppercase(),
        categoryId: joi.number().min(1),
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
            id: joi.number().integer().min(1).required(),
            name: joi.string().uppercase(),
            categoryId: joi.number().min(1),
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