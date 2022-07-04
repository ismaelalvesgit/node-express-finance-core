import joi from "@hapi/joi";

export const notifySchema = joi.object({
    content: joi.object({
        key: joi.string().required(),
        data: joi.any().required(),
    }).required(),
});