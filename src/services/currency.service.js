import * as currencyModel from "../model/currency.model";
import { setCache, getCache } from "../utils/cache";

/**
 * @param {import("../model/currency.model").CurrencyFavorite} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = () =>{
    return currencyModel.findAll();
};

/**
 * @param {import("../model/currency.model").CurrencyFavorite} where
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) =>{
    return currencyModel.findOne(where, trx);
};

/**
 * @param {import("../model/currency.model").CurrencyFavorite} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return currencyModel.create(data);
};

/**
 * @param {import("../model/currency.model").CurrencyFavorite} where 
 * @param {import("../model/currency.model").CurrencyFavorite} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return currencyModel.update(where, data);
};

/**
 * @param {import("../model/currency.model").CurrencyFavorite} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return currencyModel.del(where);
};

/**
 * @returns {Promise<void>}
 */
export const updateCache = async() =>{
    const data = await currencyModel.findAll();
    if(data.length){
        const tmp = data.map(e => e.code).join(",");
        await setCache("currency", tmp);
    }
};

/**
 * @returns {Promise<string>}
 */
export const findCache = async() =>{
    const cacheHit = await getCache("currency");
    
    if(cacheHit){
        return cacheHit;
    }

    const data = await currencyModel.findAll();
    return data.map(e => e.code).join(",");
};