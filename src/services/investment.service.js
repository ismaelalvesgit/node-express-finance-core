import * as investmentModel from "../model/investment.model";
import * as categoryModel from "../model/category.model";
import * as transactionModel from "../model/transaction.model";
import * as brapiService from "./brapi.service";
import knex from "../db";
import { BadRequest, Brapi, NotFound } from "../utils/erro";
import transactionType from "../enum/transactionType";

/**
 * @param {import("../model/investment.model").Investment} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findStokeAll = (where, sortBy, orderBy, limit) =>{
    return investmentModel.findStokeAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {Object} joinWhere 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, joinWhere, sortBy, orderBy, limit) =>{
    return investmentModel.findAll({where, sortBy, orderBy, limit, joinWhere});
};

/**
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async(data) =>{
    return knex.transaction(async(trx)=>{
        const qoute = await brapiService.findQoute(data.name);

        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
        }

        const category = await categoryModel.findAll({where: {id: data.categoryId}}, trx);
        
        if(!category.length > 0){
            throw new NotFound({code: "Category"});
        }

        return investmentModel.create(data, trx);
    });
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

    if(data.operationType === transactionType.SELL && Number(data.amount) > 0){
        data.amount = Number(data.amount) * -1;
    }

    return investmentModel.updateBalance({id: where.id}, {
        balance: Number(data.amount)
    }, trx);
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return knex.transaction(async(trx)=>{
        if(data.categoryId){
            const category = await categoryModel.findAll({where: {id: data.categoryId}}, trx);
            if(category.length === 0){
                throw new NotFound({code: "Category"});
            }
        }

        return investmentModel.update(where, data, trx);
    });
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