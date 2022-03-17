import joi from "@hapi/joi";

export const querySchema = joi.object({
    query: joi.object({
        dateStart: joi.date(),
        dateEnd: joi.date()
    }),
});