import * as eventsModel from "../model/events.model";
import knex from "../db";

/**
 * @param {import("../model/events.model").Events} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) => {
    return eventsModel.findAll({ where, sortBy, orderBy, limit });
};

/**
 * @param {import("../model/events.model").Events} where 
 * @param {import('knex').Knex.Transaction} trx   
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    return eventsModel.findOne(where, trx);
};

/**
 * @param {import("../model/events.model").Events} data 
 * @param {import('knex').Knex.Transaction} trx
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    return eventsModel.create(data, trx);
};

/**
 * @param {import("../model/events.model").Events} data
 * @param {import("../model/events.model").Events} find
 * @param {import('knex').Knex.Transaction} trx
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx, find) => {
    return eventsModel.findOrCreate(data, trx, find);
};

/**
* @param {import("../model/events.model").Events[]} data
* @returns {import('knex').Knex.QueryBuilder}
*/
export const batchCreated = (data) => {
    return knex.transaction((trx) => {
        return Promise.all(data.map((event) => {
            const { investmentId, link } = event;
            return eventsModel.findOrCreate(event, trx, {
                investmentId,
                link
            });
        }));
    });
};