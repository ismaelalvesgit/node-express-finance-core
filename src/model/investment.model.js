import knex from "../db";
import categoryType from "../enum/categoryType";
import { jsonObjectArrayQuerySelect, jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as categoryModel from "./category.model";
import * as transactionModel from "./transaction.model";

const TABLE_NAME = "investment";
const VIEW = "view_investment";
export const selectDefault = [
    "id",
    "name",
    "longName",
    "logoUrl",
    "balance",
    "currency",
    "sector",
    "volumeDay",
    "previousClosePrice",
    "changePercentDay",
    "variationDay",
    "changePercentTotal",
    "variationTotal",
    "priceDay",
    "priceDayHigh",
    "priceDayLow",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Investment
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} longName
 * @property {Number} balance
 * @property {String} sector
 * @property {Number} volumeDay
 * @property {Number} previousClosePrice
 * @property {Number} changePercentDay
 * @property {Number} variationDay
 * @property {Number} changePercentTotal
 * @property {Number} variationTotal
 * @property {Number} priceDay
 * @property {Number} priceDayHigh
 * @property {Number} priceDayLow
 * @property {Number} categoryId
 * @property {import("./category.model").Category} category
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Object} options 
 * @param {Investment} options.where 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findTransaction = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectArrayQuerySelect("transaction", transactionModel.selectDefault)),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            })
        ])
        .innerJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
        .where(options.where)
        .limit(options.limit || 10)
        .groupBy(`${TABLE_NAME}.id`);
    return transacting(query, trx);
};

/**
 * @param {Object} options 
 * @param {Investment} options.where 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findStokeAll = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectQuerySelect("category", categoryModel.selectDefault)),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            }),
            knex.raw("TRUNCATE(SUM((transaction.total + transaction.fees + transaction.brokerage + transaction.taxes)) / SUM(transaction.qnt), 0) as priceAverage"),
            knex.raw("TRUNCATE(SUM(transaction.qnt), 0) as qnt"),
            knex.raw(`TRUNCATE((balance / (select sum(balance) from ${TABLE_NAME}) * 100 ), 2) as 'percent'`),
            knex.raw(`TRUNCATE((balance / (select sum(balance) from ${TABLE_NAME} where categoryId = category.id) * 100 ), 2) as 'percentCategpry'`)
        ])
        .leftJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
        .innerJoin("category", "category.id", "=", `${TABLE_NAME}.categoryId`)
        .whereIn("category.name", [categoryType.EQUITY, categoryType.ETF_INTER])
        .whereNotNull("transaction.id")
        .groupBy(`${TABLE_NAME}.id`);
    if (options.where) {
        query.where(options.where);
    }
    if (options?.sortBy) {
        query.orderBy(options.sortBy, options.orderBy || "asc");
    }
    if (options?.limit) {
        query.limit(options.limit);
    }
    return transacting(query, trx);
};

/**
 * @param {Object} options 
 * @param {Investment} options.where 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (options, trx) => {
    const query = knex(VIEW);
    if (options?.where) {
        if(typeof options?.where === "string"){
            Object.assign(options, {
                where: JSON.parse(options?.where)
            });
        }
        const key = Object.keys(options?.where)[0];
        const value = Object.values(options?.where)[0];
        if(key.startsWith("category")){
            const e = key.split(".")[1];
            if(Array.isArray(value)){
                query.whereRaw(`category->"$.${e}" IN (?)`, [value.toString().split(",")]);
            }else{
                query.whereRaw(`category->"$.${e}" = ?`, [value]);
            }
        }else{
            query.where(`${key}`, "like", `%${value}%`);
        }
    }
    if (options?.sortBy) {
        query.orderBy(options.sortBy, options.orderBy || "asc");
    }
    if (options?.limit) {
        query.limit(options.limit);
    }
    return transacting(query, trx);
};

/**
 * @param {Investment} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    const query = knex(VIEW).first().where(where);
    return transacting(query, trx);
};

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<{balance: number}>}
 */
export const getBalance = (id, trx) => {
    const query = knex(TABLE_NAME)
        .first()
        .select(knex.raw("TRUNCATE(SUM(transaction.total), 2) as balance"))
        .innerJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
        .where({
            [`${TABLE_NAME}.id`]: id
        });

    return transacting(query, trx);
};

/**
 * @param {number} id 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<{balance: number}>}
 */
export const syncBalance = (trx) => {
    const query = knex(TABLE_NAME)
        .select(
            `${TABLE_NAME}.id`,
            `${TABLE_NAME}.name`,
            `${TABLE_NAME}.balance`,
            knex.raw("TRUNCATE(SUM(transaction.total), 2) as asyncBalance"),
        )
        .innerJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
        .groupBy(`${TABLE_NAME}.id`);

    return transacting(query, trx);
};

/**
 * @param {Investment} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx) => {
    const querySelect = knex(VIEW)
    .first()
    .transacting(trx);

    Object.keys(data).forEach((key)=>{
        if(key === "categoryId"){
            querySelect.whereRaw("category->\"$.id\" = ?", [Number(data[key])]);
        }else{
            querySelect.where(`${key}`, "=", data[key]);
        }
    });

    return querySelect
    .then(res => {
        if (!res) {
            return knex(TABLE_NAME).insert(data)
                .transacting(trx)
                .then(() => {
                    return querySelect;
                });
        } else {
            return res;
        }
    });
};

/**
 * @param {Investment} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {Investment} where 
 * @param {Investment} data 
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
 * @param {Investment} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where, trx) => {
    const query = knex(TABLE_NAME)
        .where(where)
        .del();
    return transacting(query, trx);
};