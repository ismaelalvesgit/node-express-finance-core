import { EWhereOperator } from "@helpers/ICommon";
import joi from "joi";

const filterBy = joi.string().regex(new RegExp(`\\w (${Object.values(EWhereOperator).join("|")}) \\w`), "gi");

export const queryDataSchema = joi.object({
    query: joi.object({
        page: joi.number().min(1).default(1),
        pageSize: joi.string().min(1),
        orderBy: joi.string(),
        filterBy: joi.alternatives().try(
            filterBy,
            joi.array().items(filterBy)
        ),
        orderByDescending: joi.bool().default(false),
    }).required().min(1)
});