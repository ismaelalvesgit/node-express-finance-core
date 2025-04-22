import { EBcbIndexType } from "@domain/bcb/types/IBcb";
import { EIndexerPeriod, EIndexerType, EIndexPeriod, EIndexType } from "@domain/investment/types/IInvest";
import joi from "joi";

export const indexV2Schema = joi.object({
    query: joi.object({
        period: joi.string().valid(...Object.keys(EIndexPeriod)).required(),
        type: joi.string().valid(...Object.keys(EIndexType)).required()
    }).required()
});

export const indexerSchema = joi.object({
    query: joi.object({
        period: joi.string().valid(...Object.keys(EIndexerPeriod)).required(),
        type: joi.string().valid(...Object.keys(EIndexerType)).required()
    }).required()
});

export const indexSchema = joi.object({
    query: joi.object({
        dateStart: joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
        dateEnd: joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
        type: joi.string().valid(...Object.keys(EBcbIndexType)).required()
    }).required()
});