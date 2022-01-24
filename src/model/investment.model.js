import knex from "../db";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as categoryModel from "./category.model";

const TABLE_NAME = "investment";
export const selectDefault = [
    "id",
    "name",
    "longName",
    "balance",
    "sector",
    "volumeDay",
    "previousClosePrice",
    "changePercentDay",
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
 * @param {Object} options.joinWhere 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectQuerySelect("category", categoryModel.selectDefault)),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            })
        ])
        .innerJoin("category", "category.id", "=", `${TABLE_NAME}.categoryId`);
    if (options?.where) {
        let tableName;
        let value;
        if(typeof options?.where === "object"){
            tableName = Object.keys(options?.where)[0];
            value = Object.values(options?.where)[0];
        }else{
            tableName = Object.keys(JSON.parse(options?.where))[0];
            value = Object.values(JSON.parse(options?.where))[0];
        }
        query.where(`${TABLE_NAME}.${tableName}`, "like", `%${value}%`);
    }
    if(options.joinWhere){
        query.where(options.joinWhere);
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
export const getBalance = (where, trx) => {
    const query = knex(TABLE_NAME)
        .select("balance")
        .first()
        .where(where);
    return transacting(query, trx);
};

/**
 * @param {Investment} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = (data, trx) => {
    if (!trx) {
        trx = knex.transaction();
    }
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