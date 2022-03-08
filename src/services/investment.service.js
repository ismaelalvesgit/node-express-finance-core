import * as investmentModel from "../model/investment.model";
import * as categoryModel from "../model/category.model";
import * as transactionModel from "../model/transaction.model";
import * as iexcloundService from "./iexclound.service";
import knex from "../db";
import { BadRequest, Brapi, NotFound } from "../utils/erro";
import { categoryIsBR, findBrapiQoute, searchBrapiQoute } from "../utils";
import env from "../env";

/**
 * @param {import("../model/investment.model").Investment} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findStokeAll = (where, sortBy, orderBy, limit) =>{
    return investmentModel.findStokeAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) =>{
    return investmentModel.findAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) =>{
    return investmentModel.findOne(where, trx);
};

/**
 * 
 * @param {string} search 
 * @param {import('../enum/categoryType')} category 
 */
export const findAvailable = (search, category) =>{
    return categoryIsBR(category) ? searchBrapiQoute(category, search) : new Error("Not Implemented");
};

/**
 * @param {import("../model/investment.model").Investment} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async(data) =>{
    return knex.transaction(async(trx)=>{

        const category = await categoryModel.findAll({where: {id: data.categoryId}}, trx);
        
        if(!category.length > 0){
            throw new NotFound({code: "Category"});
        }

        const qoute = categoryIsBR(category[0].name) ? await findBrapiQoute(category[0].name, data.name) : 
            await iexcloundService.findQoute(data.name);

        if (!qoute) {
            throw new Brapi({ statusCode: 404, message: "Investment not Found" });
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

        if(data.logoUrl && data.logoUrl.endsWith("favicon.svg")){
            data.logoUrl = `${env.server.url}/static/uploads/system/default.png`;
        }

        return investmentModel.update(where, data, trx);
    });
};

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const getBalance = async(id, trx) =>{
    return investmentModel.getBalance(id, trx);
};


/**
 * @param {import("../model/investment.model").Investment} where 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const updateBalance = async(where, trx) =>{
    const { balance } = await investmentModel.getBalance(where.id, trx);

    return investmentModel.update({id: where.id}, {
        balance: Number(balance)
    }, trx);
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