import joi from "@hapi/joi";

export const findAllEventsSchema = joi.object({
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