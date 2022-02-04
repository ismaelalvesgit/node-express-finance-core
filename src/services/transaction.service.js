import * as transactionModel from "../model/transaction.model";
import * as categoryModel from "../model/category.model";
import * as brokerModel from "../model/broker.model";
import * as brapiService from "./brapi.service";
import * as investmentService from "./investment.service";
import knex from "../db";
import { Brapi } from "../utils/erro";
import transactionType from "../enum/transactionType";

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) => {
    return transactionModel.findAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @param {string} date
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllDividensByMonth = (where, date, trx) => {
    return transactionModel.findAllDividensByMonth({where, date}, trx);
};

/**
 * @param {import("../model/transaction.model").Transaction} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async (data) => {
    return knex.transaction(async (trx) => {
        const qoute = await brapiService.findQoute(data.investment);
        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
        }

        let total = 0;
        let qnt = 0;

        if(data.type === transactionType.BUY){
            total = Number(data.qnt) * (data.price);
            qnt = Number(data.qnt);
        }else{
            total = (Number(data.qnt) * (data.price)) * -1;
            qnt = Number(data.qnt) * -1;
        }

        const category = await categoryModel.findOrCreate({ name: data.category }, trx);
        const broker = await brokerModel.findOrCreate({ name: data.broker }, trx);
        const investment = await investmentService.findOrCreate({ name: data.investment, categoryId: category.id }, trx);
        
        await investmentService.updateBalance(investment, {
            amount: total,
            operationType: data.type,
        }, trx);

        return transactionModel.create({
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt,
            price: data.price,
            total,
        }, trx);
    });
};

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @param {import("../model/transaction.model").Transaction} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) => {
    return knex.transaction(async (trx) => {
        const qoute = await brapiService.findQoute(data.investment);
        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
        }
        const category = await categoryModel.findOrCreate({ name: data.category }, trx);
        const broker = await brokerModel.findOrCreate({ name: data.broker }, trx);
        const investment = await investmentService.findOrCreate({ name: data.investment, categoryId: category.id }, trx);

        let total = 0;

        if(data.type === transactionType.BUY){
            total = Number(data.qnt) * (data.price);
        }else{
            total = (Number(data.qnt) * (data.price)) * -1;
        }

        return transactionModel.update(where, {
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt: data.qnt,
            price: data.price,
            total
        }, trx);
    });
};

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) => {
    return transactionModel.del(where);
};