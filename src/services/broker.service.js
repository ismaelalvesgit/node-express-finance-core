import * as brokerModel from "../model/broker.model";
import * as transactionModel from "../model/transaction.model";
import knex from "../db";
import { BadRequest } from "../utils/erro";

/**
 * @param {import("../model/broker.model").Broker} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) =>{
    return brokerModel.findAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/broker.model").Broker} where
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) =>{
    return brokerModel.findOne(where, trx);
};

/**
 * @param {import("../model/broker.model").Broker} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return brokerModel.create(data);
};

/**
 * @param {import("../model/broker.model").Broker} where 
 * @param {import("../model/broker.model").Broker} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return brokerModel.update(where, data);
};

/**
 * @param {import("../model/broker.model").Broker} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return knex.transaction(async(trx)=>{
        const transaction = await transactionModel.findOne({brokerId: where.id}, null, trx);
        if(transaction){
            throw new BadRequest({message: "Unable to remove because broker has transactions"});
        }
        return brokerModel.del(where, trx);
    });
};