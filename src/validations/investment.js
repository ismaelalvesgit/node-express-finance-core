import joi from "@hapi/joi";

export const findAllInvestmentSchema = joi.object({
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

export const createInvestmentSchema = joi.object({
    body: joi.object({
        categoryId: joi.number().integer().unsafe().required(),
        name: joi.string().required(),
        longName: joi.string(),
        sector: joi.string().required(),
    }).required(),
});

export const updateInvestmentSchema = joi.object({
    body: joi.object({
        categoryId: joi.number().integer().unsafe(),
        longName: joi.string(),
        sector: joi.string(),
    }).min(1),
});