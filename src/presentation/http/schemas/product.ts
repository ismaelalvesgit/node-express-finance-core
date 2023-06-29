import joi from "joi";

export const createProductSchema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        imageUrl: joi.string().default("https://github.com/ismaelalvesgit"),
        categoryId: joi.number().min(1).required(),
        description: joi.string(),
        price: joi.number().min(0).required(),
        quantity: joi.number().min(0).required(),
    }).required()
});

export const updateProductSchema = joi.object({
    body: joi.object({
        name: joi.string(),
        imageUrl: joi.string(),
    }).required().min(1)
});