import joi from "joi";

export const createCategorySchema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        imageUrl: joi.string().default("https://github.com/ismaelalvesgit"),
    }).required()
});

export const updateCategorySchema = joi.object({
    body: joi.object({
        name: joi.string(),
        imageUrl: joi.string(),
    }).required().min(1)
});