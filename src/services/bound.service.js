import * as boundModel from "../model/bound.model";
import { setCache, getCache } from "../utils/cache";

/**
 * @param {import("../model/bound.model").BoundList} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = () =>{
    return boundModel.findAll();
};

/**
 * @param {import("../model/bound.model").BoundList} where
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) =>{
    return boundModel.findOne(where, trx);
};

/**
 * @param {import("../model/bound.model").BoundList} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return boundModel.create(data);
};

/**
 * @param {import("../model/bound.model").BoundList} where 
 * @param {import("../model/bound.model").BoundList} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return boundModel.update(where, data);
};

/**
 * @param {import("../model/bound.model").BoundList} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return boundModel.del(where);
};

/**
 * @returns {Promise<void>}
 */
export const updateCache = async() =>{
    const data = await boundModel.findAll();
    if(data.length){
        const tmp = data.map(e => e.code).join(",");
        await setCache("bound", tmp);
    }
};

/**
 * @returns {Promise<string>}
 */
export const findCache = async() =>{
    const cacheHit = await getCache("bound");
    
    if(cacheHit){
        return cacheHit;
    }

    const data = await boundModel.findAll();
    return data.map(e => e.code).join(",");
};