import knex from "../db";
import transacting from "../utils/transacting";

const TABLE_NAME = "currencyFavorite";
export const selectDefault = [
    "id",
    "code",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef CurrencyFavorite
 * @type {Object}
 * @property {Number} id
 * @property {String} code
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (trx) => {
    const query = knex(TABLE_NAME);
    return transacting(query, trx);
};

/**
 * @param {CurrencyFavorite} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    const query = knex(TABLE_NAME).first().where(where);
    return transacting(query, trx);
};

/**
 * @param {CurrencyFavorite} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx) => {
    return knex(TABLE_NAME).where(data)
        .first()
        .transacting(trx)
        .then(res => {
            if (!res) {
                return knex(TABLE_NAME).insert(data)
                    .transacting(trx)
                    .then(() => {
                        return knex(TABLE_NAME).where(data).first().transacting(trx);
                    });
            } else {
                return res;
            }
        });
};

/**
 * @param {CurrencyFavorite} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {CurrencyFavorite} where 
 * @param {CurrencyFavorite} data 
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
 * @param {CurrencyFavorite} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where, trx) => {
    const query = knex(TABLE_NAME)
        .where(where)
        .del();
    return transacting(query, trx);
};