import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "transaction";

/**
 * @typedef Transaction
 * @type {Object}
 * @property {Number} id
 * @property {import('../enum/transactionType')} type
 * @property {Date} negotiationDate
 * @property {Date} dueDate
 * @property {Number} qnt
 * @property {Number} price
 * @property {Number} total
 * @property {Number} brokerId
 * @property {import("./broker.model").Broker} broker
 * @property {Number} investmentId
 * @property {import("./investment.model").Investment} investment
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Object} options 
 * @param {Transaction} options.where 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(`
                JSON_OBJECT(
                    'id', broker.id,
                    'name', broker.name, 
                    'createdAt', broker.createdAt, 
                    'updatedAt', broker.updatedAt
                ) as broker
            `),
            knex.raw(`
                JSON_OBJECT(
                    'id', category.id,
                    'name', category.name, 
                    'createdAt', category.createdAt, 
                    'updatedAt', category.updatedAt
                ) as category
            `),
            knex.raw(`
                JSON_OBJECT(
                    'id', investment.id,
                    'name', investment.name, 
                    'regularMarketPrice', investment.regularMarketPrice, 
                    'regularMarketDayHigh', investment.regularMarketDayHigh, 
                    'regularMarketDayLow', investment.regularMarketDayLow, 
                    'createdAt', investment.createdAt, 
                    'updatedAt', investment.updatedAt
                ) as investment
            `),
            `${TABLE_NAME}.id`,
            `${TABLE_NAME}.type`,
            `${TABLE_NAME}.negotiationDate`,
            `${TABLE_NAME}.dueDate`,
            `${TABLE_NAME}.qnt`,
            `${TABLE_NAME}.price`,
            `${TABLE_NAME}.total`,
            `${TABLE_NAME}.createdAt`,
            `${TABLE_NAME}.updatedAt`,
        ])
        .innerJoin('broker', 'broker.id', '=', `${TABLE_NAME}.brokerId`)
        .innerJoin('investment', 'investment.id', '=', `${TABLE_NAME}.investmentId`)
        .innerJoin('category', 'category.id', '=', `investment.id`);
    if (options?.where) {
        let tableName;
        let value;
        if(Object.keys(options?.where).length === 1){
            tableName = Object.keys(options?.where)[0]
            value = Object.values(options?.where)[0]
        }else{
            tableName = Object.keys(JSON.parse(options?.where))[0];
            value = Object.values(JSON.parse(options?.where))[0];
        }
        query.where(`${TABLE_NAME}.${tableName}`, "like", `%${value}%`);
    }
    if (options?.sortBy) {
        query.orderBy(`${TABLE_NAME}.${options.sortBy}`, options.orderBy || "asc");
    }
    if (options?.limit) {
        query.limit(options.limit);
    }

    console.log(query.toQuery().toString())
    return transacting(query, trx);
};

/**
 * @param {Transaction} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {Transaction} where 
 * @param {Transaction} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data, trx) => {
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};

/**
 * @param {Transaction} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where, trx) => {
    const query = knex(TABLE_NAME)
        .where(where)
        .del();
    return transacting(query, trx);
};