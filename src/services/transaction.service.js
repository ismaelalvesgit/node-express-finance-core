import * as transactionModel from "../model/transaction.model";
import * as categoryModel from "../model/category.model";
import * as brokerModel from "../model/broker.model";
import * as iexcloundService from "./iexclound.service";
import * as investmentService from "./investment.service";
import knex from "../db";
import { Brapi, NotFound } from "../utils/erro";
import transactionType from "../enum/transactionType";
import { categoryIsBR, findBrapiQoute } from "../utils";

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

        const qoute = categoryIsBR(data.category) ? await findBrapiQoute(data.category, data.investment) : 
            await iexcloundService.findQoute(data.investment);

        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
        }

        const category = await categoryModel.findOrCreate({ name: data.category }, trx);
        const broker = await brokerModel.findOrCreate({ name: data.broker }, trx);
        const investment = await investmentService.findOrCreate({ name: data.investment, categoryId: category.id }, trx);

        let total = 0;
        let qnt = 0;
        let profit = 0;

        if(data.type === transactionType.BUY){
            total = Number(data.qnt) * Number(data.price);
            qnt = Number(data.qnt);
        }else{
            profit = (Number(data.price) - Number(investment.priceAverage)) * Number(data.qnt);
            qnt = Number(data.qnt) * -1;
            total = (Number(data.qnt) * Number(data.price)) * -1;
            if(investment.balance && Number(investment.balance) < Math.abs(total)){
                total = Number(investment.balance) * -1;
            }
        } 

        await transactionModel.create({
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt,
            price: data.price,
            total,
            profit,
        }, trx);

        return investmentService.updateBalance(investment, trx);
    });
};

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @param {import("../model/transaction.model").Transaction} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) => {
    return knex.transaction(async (trx) => {
        const qoute = categoryIsBR(data.category) ? await findBrapiQoute(data.category, data.investment) : 
            await iexcloundService.findQoute(data.investment);

        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
        }
        
        const category = await categoryModel.findOrCreate({ name: data.category }, trx);
        const broker = await brokerModel.findOrCreate({ name: data.broker }, trx);
        const investment = await investmentService.findOrCreate({ name: data.investment, categoryId: category.id }, trx);
       
        let total = 0;
        let qnt = 0;
        let profit = 0;

        if(data.type === transactionType.BUY){
            total = Number(data.qnt) * Number(data.price);
            qnt = Number(data.qnt);
        }else{
            const { priceAverage, balance } = await transactionModel.getLastAveragePrice({
                id: where.id,
                investmentId: investment.id
            }, trx);

            profit = (Number(data.price) - Number(priceAverage)) * Number(data.qnt);
            qnt = Number(data.qnt) * -1;
            total = (Number(data.qnt) * Number(data.price)) * -1;
            if(balance && Number(balance) < Math.abs(total)){
                total = Number(balance) * -1;
            }
        } 

        await transactionModel.update(where, {
            brokerId: broker.id,
            investmentId: investment.id,
            type: data.type,
            negotiationDate: data.negotiationDate,
            dueDate: data.dueDate,
            qnt,
            price: data.price,
            total,
            profit,
        }, trx);

        return investmentService.updateBalance(investment, trx);
    });
};

/**
 * @param {import("../model/transaction.model").Transaction} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) => {
    return knex.transaction(async (trx) => {
        const transaction = await transactionModel.findOne({id: where.id}, ["investment"], trx);
    
        if (!transaction) {
            throw new NotFound({code: "Investment"});
        }
        
        await transactionModel.del(where, trx);

        return investmentService.updateBalance({id: transaction.investment.id}, trx);
    });
};