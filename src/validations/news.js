import joi from "@hapi/joi";

export const findAllNewsSchema = joi.object({
    query: joi.object({
        languages: joi.string().default("pt"),
        keywords: joi.string(),
        categories: joi.string(),
        source: joi.string(),
        countries: joi.string(),
    }),
});