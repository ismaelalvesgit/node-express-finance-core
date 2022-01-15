import joi from "@hapi/joi";

export const findAllCategorySchema = joi.object({
    query: joi.object({
        search: joi.string().custom((value, helpers)=>{
            try {
                const test = JSON.parse(value);
                if(Object.keys(test).length > 1){
                    return helpers.message("Must have one attribute");
                }
                return value;
            } catch (error) {
                return helpers.message("Only object type");
            }
        }),
        sortBy: joi.string(),
        orderBy: joi.string().valid("asc", "desc"),
        limit: joi.number().integer().positive().min(1),
    }),
});

export const createCategorySchema = joi.object({
    body: joi.object({
        name: joi.string().required(),
    }).required(),
});

export const updateCategorySchema = joi.object({
    body: joi.object({
        name: joi.string().required(),
    }),
});