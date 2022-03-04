import * as categoryModel from "../model/category.model";
import * as investmentModel from "../model/investment.model";
import knex from "../db";
import { BadRequest } from "../utils/erro";

/**
 * @param {import("../model/category.model").Category} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) =>{
    return categoryModel.findAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/category.model").Category} where
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) =>{
    return categoryModel.findOne(where, trx);
};

/**
 * @param {import("../model/category.model").Category} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return categoryModel.create(data);
};

/**
 * @param {import("../model/category.model").Category} where 
 * @param {import("../model/category.model").Category} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return categoryModel.update(where, data);
};

/**
 * @param {import("../model/category.model").Category} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return knex.transaction(async(trx)=>{
        const [ investment ] = await investmentModel.findTransaction({where: {categoryId: where.id}, limit: 1}, trx);
        if(investment){
            throw new BadRequest({message: "Unable to remove because category has transactions"});
        }
        return categoryModel.del(where, trx);
    });
};