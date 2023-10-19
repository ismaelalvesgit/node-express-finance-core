import joi from "joi";
import { EDividendsStatus, EDividendsType } from "@domain/dividends/types/IDividends";

export const createDividendsSchema = joi.object({
    body: joi.object({
        investmentId: joi.number().positive().min(1).required(),
        brokerId: joi.number().positive().min(1).required(),
        status: joi.string().valid(...Object.keys(EDividendsStatus)).default(EDividendsStatus.PROVISIONED),
        type: joi.string().valid(...Object.keys(EDividendsType)).required(),
        dueDate: joi.date().required(),
        dateBasis: joi.date().required(),
        qnt: joi.number().unsafe().positive().min(1).required(),
        price: joi.number().unsafe().positive().required(),
        fees: joi.number().unsafe().min(0),
        currency: joi.string(),
    }).required(),
});

export const autoCreateDividendsSchema = joi.object({
    body: joi.array().items(
        joi.object({
            investmentId: joi.number().unsafe().positive().min(1).required(),
            type: joi.string().valid(...Object.keys(EDividendsType)).required(),
            dueDate: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
            dateBasis: joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
            price: joi.number().unsafe().positive().required(),
            fees: joi.number().unsafe().min(0),
        }).required()
    ).min(1),
});

export const autoPaidDividendsSchema = joi.object({
    body: joi.object({
        dueDate: joi.date().required()
    }).min(1)
});