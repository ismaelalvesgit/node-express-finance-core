import * as eventsModel from "../model/events.model";

/**
 * @param {import("../model/events.model").Events} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) => {
    return eventsModel.findAll({ where, sortBy, orderBy, limit });
};

/**
 * @param {import("../model/events.model").Events} data 
 * @param {import('knex').Knex.Transaction} trx
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async (data, trx) => {
    return eventsModel.create(data, trx);
};

/**
 * @param {import("../model/events.model").Events} data
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findOrCreate = async (data, trx) => {
    return eventsModel.findOrCreate(data, trx);
 };