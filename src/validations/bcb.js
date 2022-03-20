import joi from "@hapi/joi";

export const querySchema = joi.object({
    query: joi.object({
        dateStart: joi.date(),
        dateEnd: joi.date()
    }),
});

/**
 * 
 * @param {Array<any>} valid 
 * @returns 
 */
export const indicadorSchema = (valid)=>{
    return joi.object({
        query: joi.object({
            type: joi.string().valid(...valid)
        }),
    });
};