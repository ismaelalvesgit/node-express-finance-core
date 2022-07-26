import joi from "@hapi/joi";

export const investmentSchema = joi.object({
    content: joi.array().items(
        joi.object({
            id: joi.number().integer().unsafe().required(),
        })
    ).required(),
});