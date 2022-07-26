import knex from "../db";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as brokerModel from "./broker.model";
import * as categoryModel from "./category.model";
import * as investmentModel from "./investment.model";

const TABLE_NAME = "transaction";
export const selectDefault = [
    "id",
    "type",
    "negotiationDate",
    "brokerage",
    "fees",
    "taxes",
    "qnt",
    "price",
    "total",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Transaction
 * @type {Object}
 * @property {Number} id
 * @property {import('../enum/transactionType')} type
 * @property {Date} negotiationDate
 * @property {Number} brokerage
 * @property {Number} fees
 * @property {Number} taxes
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


const querySelect = ()=>{
    return knex(TABLE_NAME)
    .select([
        knex.raw(jsonObjectQuerySelect("broker", brokerModel.selectDefault)),
        knex.raw(jsonObjectQuerySelect("category", categoryModel.selectDefault)),
        knex.raw(jsonObjectQuerySelect("investment", investmentModel.selectDefault)),
        ...selectDefault.map((select) => {
            return `${TABLE_NAME}.${select}`;
        })
    ])
    .innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`)
    .innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`)
    .innerJoin("category", "category.id", "=", "investment.categoryId");
};

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
    const query = querySelect();
    if (options?.where) {
        let tableName;
        let value;
        if (typeof options?.where === "object") {
            tableName = Object.keys(options?.where)[0];
            value = Object.values(options?.where)[0];
        } else {
            tableName = Object.keys(JSON.parse(options?.where))[0];
            value = Object.values(JSON.parse(options?.where))[0];
        }
        query.where(`${TABLE_NAME}.${tableName}`, "like", `${value}`);
    }
    if (options?.sortBy) {
        query.orderBy(`${TABLE_NAME}.${options.sortBy}`, options.orderBy || "asc");
    }
    if (options?.limit) {
        query.limit(options.limit);
    }
    
    return transacting(query, trx);
};

/**
 * @param {Transaction} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<Transaction>}
 */
export const findOne = (where, trx) => {
    const query = querySelect()
        .first();

    Object.keys(where).forEach((key) => {
        query.where(`${TABLE_NAME}.${key}`, "=", where[key]);
    });
    
    return transacting(query, trx);
};

/**
 * @param {Object} options 
 * @param {Transaction} options.where 
 * @param {Transaction} options.date 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllDividensByMonth = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectQuerySelect("broker", brokerModel.selectDefault)),
            knex.raw(`SUM(${TABLE_NAME}.qnt) as qnt`),
        ])
        .sum({ qnt: "qnt" })
        .innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`)
        .groupBy("broker.id");
    if (options?.where) {
        query.where(options?.where);
    }

    if (options?.date) {
        query.where("negotiationDate", "<=", options?.date);
    }
    
    return transacting(query, trx);
};

/**
 * @param {object} where  
 * @param {number} where.id  
 * @param {number} where.investmentId 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {Promise<{priceAverage: number, balance: number, quantity: number}>}
 */
export const getLastAveragePrice = (where, trx) => {
    const query = knex(TABLE_NAME)
        .first()
        .select([
            knex.raw("TRUNCATE(SUM((total + fees + brokerage + taxes)) / SUM(qnt), 0) as priceAverage"),
            knex.raw("TRUNCATE(SUM(total), 2) as balance"),
            knex.raw("TRUNCATE(SUM(qnt), 0) as quantity"),
        ])
        .where({
            investmentId: where.investmentId
        })
        .whereNot("id", where.id);
    
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