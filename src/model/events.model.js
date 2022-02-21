import knex from "../db";
import { jsonObjectQuerySelect } from "../utils";
import transacting from "../utils/transacting";
import * as investmentModel from "./investment.model";

const TABLE_NAME = "events";
export const selectDefault = [
    "id",
    "dateReference",
    "dateDelivery",
    "assetMainId",
    "link",
    "description",
    "createdAt",
    "updatedAt",
];

/**
 * @typedef Events
 * @type {Object}
 * @property {Number} id
 * @property {Number} investmentId
 * @property {import("./investment.model").Investment} investment
 * @property {Date} dateReference
 * @property {Date} dateDelivery
 * @property {Number} assetMainId
 * @property {String} link
 * @property {String} description
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Object} options 
 * @param {Events} options.where 
 * @param {string} options.sortBy 
 * @param {'desc'|'asc'} options.orderBy 
 * @param {number} options.limit 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (options, trx) => {
    const query = knex(TABLE_NAME)
        .select([
            knex.raw(jsonObjectQuerySelect("investment", investmentModel.selectDefault)),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            })
        ])
        .innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`)
        .orderBy(options.sortBy || "dateReference", options.orderBy || "desc");

    if (options?.where) {
        let tableName;
        let value;
        if(typeof options?.where === "object"){
            tableName = Object.keys(options?.where)[0];
            value = Object.values(options?.where)[0];
        } else {
            tableName = Object.keys(JSON.parse(options?.where))[0];
            value = Object.values(JSON.parse(options?.where))[0];
        }
        query.where(`${TABLE_NAME}.${tableName}`, "=", `${value}`);
    }

    if (options?.limit) {
        query.limit(options.limit);
    }

    return transacting(query, trx);
};

/**
 * @param {Dividends} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const create = (data, trx) => {
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};


/**
 * @param {Events} data 
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