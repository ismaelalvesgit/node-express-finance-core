import * as transactionModel from "../model/transaction.model";
import * as investmentModel from "../model/investment.model";
import * as categoryModel from "../model/category.model";
import * as brokerModel from "../model/broker.model";
import * as brapiService from "./brapi.service";
import knex from "../db";
import { Brapi } from "../utils/erro";

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
        const category = await categoryModel.findOrCreate({ name: data.category }, trx);
        const broker = await brokerModel.findOrCreate({ name: data.broker }, trx);
        const investment = await investmentModel.findOrCreate({ name: data.investment, categoryId: category.id }, trx);
        return transactionModel.create({
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt: data.qnt,
            price: data.price,
            total: data.qnt * data.price,
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
        const investment = await investmentModel.findOrCreate({ name: data.investment, categoryId: category.id }, trx);
        return transactionModel.update(where, {
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt: data.qnt,
            price: data.price,
            total: data.qnt * data.price,
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