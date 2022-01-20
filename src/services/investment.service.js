import * as investmentModel from "../model/investment.model";
import * as transactionModel from "../model/transaction.model";
import knex from "../db";
import { BadRequest, NotFound } from "../utils/erro";
import transactionType from "../enum/transactionType";

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {Object} joinWhere 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, joinWhere) =>{
    return investmentModel.findAll({where, joinWhere});
};

/**
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return investmentModel.create(data);
};

/**
 * @param {import("../model/investment.model").Investment} data 
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx) =>{
    return investmentModel.findOrCreate(data, trx);
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {Object} data
 * @param {number} data.amount
 * @param {import("../enum/transactionType")} data.operationType
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const updateBalance = async(where, data, trx) =>{
    if(!trx){
        trx = knex.transaction();
    }

    const investment = await investmentModel.getBalance({id: where.id}, trx);

    if(!investment){
        throw new NotFound({message: "Invenstment not found"});
    } 

    if(data.operationType === transactionType.BUY){
        investment.balance = parseInt(investment.balance) + data.amount;
    }else{
        investment.balance = parseInt(investment.balance) - data.amount;
    }

    return investmentModel.update({id: where.id}, {
        balance: investment.balance
    }, trx);
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return investmentModel.update(where, data);
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return knex.transaction(async(trx)=>{
        const transaction  = await transactionModel.findOne({ investmentId: where.id }, null, trx);
        if(transaction){
            throw new BadRequest({message: "Unable to remove because investment has transactions"});
        }
        return investmentModel.del(where, trx);
    });
};