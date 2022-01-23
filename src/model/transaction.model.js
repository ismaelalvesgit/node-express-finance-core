import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "transaction";
export const selectDefault = [
    "id",
    "type",
    "negotiationDate",
    "dueDate",
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
 * @property {Date} dueDate
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
                    'longName', investment.longName, 
                    'balance', investment.balance, 
                    'sector', investment.sector, 
                    'previousClosePrice', investment.previousClosePrice, 
                    'volumeDay', investment.volumeDay, 
                    'changePercentDay', investment.changePercentDay, 
                    'priceDay', investment.priceDay, 
                    'priceDayHigh', investment.priceDayHigh, 
                    'priceDayLow', investment.priceDayLow, 
                    'createdAt', investment.createdAt, 
                    'updatedAt', investment.updatedAt
                ) as investment
            `),
            ...selectDefault.map((select) => {
                return `${TABLE_NAME}.${select}`;
            })
        ])
        .innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`)
        .innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`)
        .innerJoin("category", "category.id", "=", "investment.id");
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
        query.where(`${TABLE_NAME}.${tableName}`, "like", `%${value}%`);
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
 * @param {Array<string} join 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, join = [], trx) => {
    const query = knex(TABLE_NAME)
        .first()
        .select(selectDefault.map((select) => {
            return `${TABLE_NAME}.${select}`;
        }));

    switch (join) {
        case "broker":
            query.innerJoin("broker", "broker.id", "=", `${TABLE_NAME}.brokerId`);
            query.select([
                knex.raw(`
                    JSON_OBJECT(
                        'id', broker.id,
                        'name', broker.name, 
                        'createdAt', broker.createdAt, 
                        'updatedAt', broker.updatedAt
                    ) as broker
                `),
            ]);
            break;
        case "investment":
            query.innerJoin("investment", "investment.id", "=", `${TABLE_NAME}.investmentId`);
            query.select([
                knex.raw(`
                    JSON_OBJECT(
                        'id', investment.id,
                        'name', investment.name, 
                        'longName', investment.longName, 
                        'balance', investment.balance, 
                        'sector', investment.sector, 
                        'previousClosePrice', investment.previousClosePrice, 
                        'volumeDay', investment.volumeDay, 
                        'changePercentDay', investment.changePercentDay, 
                        'priceDay', investment.priceDay, 
                        'priceDayHigh', investment.priceDayHigh, 
                        'priceDayLow', investment.priceDayLow, 
                        'createdAt', investment.createdAt, 
                        'updatedAt', investment.updatedAt
                    ) as investment
                `),
            ]);
            break;
        case "category":
            query.innerJoin("category", "category.id", "=", "investment.id");
            query.select([
                knex.raw(`
                    JSON_OBJECT(
                        'id', category.id,
                        'name', category.name, 
                        'createdAt', category.createdAt, 
                        'updatedAt', category.updatedAt
                    ) as category
                `)
            ]);
            break;

        default:
            break;
    }

    if (where) {
        const tableName = Object.keys(where)[0];
        const value = Object.values(where)[0];
        query.where(`${TABLE_NAME}.${tableName}`, "like", `%${value}%`);
    }

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
        .first()
        .sum({ qnt: "qnt" });
    if (options?.where) {
        query.where(options?.where);
    }

    if (options?.date) {
        query.where("negotiationDate", "<=", options?.date);
    }

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