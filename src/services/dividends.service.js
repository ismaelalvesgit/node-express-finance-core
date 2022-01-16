import * as dividendsModel from "../model/dividends.model";
import * as investmentModel from "../model/investment.model";
import knex from "../db";
import { NotFound } from "../utils/erro";

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) => {
    return dividendsModel.findAll({ where, sortBy, orderBy, limit });
};

/**
 * @param {import("../model/dividends.model").Dividends} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) => {
    return knex.transaction(async (trx) => {
        const [ investment ] = await investmentModel.findAll({ where: { id: data.investmentId } }, trx);
        if (!investment) {
            throw new NotFound({ code: "Dividends" });
        }
        return dividendsModel.create({
            ...data,
            total: data.qnt * data.price
        }, trx);
    });
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @param {import("../model/dividends.model").Dividends} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) => {
    return dividendsModel.update(where, data);
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) => {
    return knex.transaction(async (trx) => {
        return dividendsModel.del(where, trx);
    });
};