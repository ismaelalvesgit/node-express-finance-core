import joi from "@hapi/joi";

export const createCurrencySchema = joi.object({
    body: joi.object({
        code: joi.string().required(),
    }).required(),
});
