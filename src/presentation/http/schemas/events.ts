import joi from "joi";

export const batchEventsSchema = joi.object({
    body: joi.array().items(
        joi.object({
            investmentId: joi.number().unsafe().positive().min(1).required(),
            link: joi.string().required().uri(),
            dateReference: joi.date().required(),
            dateDelivery: joi.date().required(),
            description: joi.string().required(),
        }).required()
    ).min(1),
});