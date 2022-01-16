import * as investmentModel from "../model/investment.model";
import * as transactionModel from "../model/transaction.model";
import knex from "../db";
import { BadRequest } from "../utils/erro";

/**
 * @param {import("../model/investment.model").Investment} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where) =>{
    return investmentModel.findAll({where});
};

/**
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return investmentModel.create(data);
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
        const [ transaction ] = await transactionModel.findAll({where: { investmentId: where.id }}, trx);
        if(transaction){
            throw new BadRequest({message: "Unable to remove because investment has transactions"});
        }
        return investmentModel.del(where, trx);
    });
};