import joi from "joi";

export const brokerSchema = joi.object({
    body: joi.object({
        name: joi.string().required().uppercase()
    }).required()
});