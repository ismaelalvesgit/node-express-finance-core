import { ECategoryType } from "@domain/category/types/ICategory";
import { ETransactionEventDirection, ETransactionType } from "@domain/transaction/types/ITransaction";
import joi from "joi";

export const transactionSchema = joi.object({
    body: joi.object({
        investment: joi.string().required().uppercase(),
        brokerId: joi.number().required().min(0),
        category: joi.string().valid(...Object.values(ECategoryType)).required(),
        type: joi.string().valid(...Object.keys(ETransactionType)).required(),
        negotiationDate: joi.date().required(),
        brokerage: joi.number().unsafe().positive(),
        fees: joi.number().unsafe().positive(),
        taxes: joi.number().unsafe().positive(),
        qnt: joi.number().unsafe().positive().required(),
        price: joi.number().unsafe().positive().required(),
    }).required(),
});

export const eventTransactionSchema = joi.object({
    body: joi.object({
        investmentId: joi.number().unsafe().positive().required(),
        quantity: joi.number().unsafe().positive().required(),
        direction: joi.string().valid(...Object.values(ETransactionEventDirection)).required(),
    }).required(),
});
