import joi from "@hapi/joi";

export const querySchema = joi.object({
    query: joi.object({
        dateStart: joi.date(),
        dateEnd: joi.date()
    }),
});

export const queryIndicadorSchema = joi.object({
    query: joi.object({
        type: joi.string().valid("-1", "0", "1", "2", "3", "4")
    }),
});
export const queryIndicador2Schema = joi.object({
    query: joi.object({
        type: joi.string().valid("0", "1", "2")
    }),
});