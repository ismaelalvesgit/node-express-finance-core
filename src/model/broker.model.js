import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "broker";

/**
 * @typedef Broker
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Object} options 
 * @param {Broker} options.where 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAll = (options, trx)=>{
    const query = knex(TABLE_NAME);
    if(options?.where){
        const tableName = Object.keys(JSON.parse(options?.where))[0];
        const value = Object.values(JSON.parse(options?.where))[0];
        query.where(tableName, "like", `%${value}%`);
    }
    if(options?.sortBy){
        query.orderBy(options.sortBy, options.orderBy || "asc");
    }
    if(options?.limit){
        query.limit(options.limit);
    }
    return transacting(query, trx);
};

/**
 * @param {Broker} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const create = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {Broker} where 
 * @param {Broker} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const update = (where, data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};

/**
 * @param {Broker} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .del();
    return transacting(query, trx);
};