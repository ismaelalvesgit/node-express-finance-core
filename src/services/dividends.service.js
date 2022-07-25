import * as dividendsModel from "../model/dividends.model";
import * as investmentModel from "../model/investment.model";
import * as brokerModel from "../model/broker.model";
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
 * @param {import("../model/dividends.model").Dividends} where
 * @param {import('knex').Knex.Transaction} trx    
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOne = (where, trx) => {
    return dividendsModel.findOne(where, trx);
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findUpdateDivideds = (date) => {
    return dividendsModel.findUpdateDivideds(date);
};

/**
 * @param {import("../model/dividends.model").Dividends} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async (data) => {
    return knex.transaction(async (trx) => {
        const [investment] = await investmentModel.findAll({ where: { id: data.investmentId } }, trx);
        if (!investment) {
            throw new NotFound({ code: "Dividends" });
        }
        const [broker] = await brokerModel.findAll({ where: { id: data.brokerId } }, trx);
        if (!broker) {
            throw new NotFound({ code: "Dividends" });
        }
        return dividendsModel.create({
            ...data,
            total: Number(data.qnt) * Number(data.price)
        }, trx);
    });
};

/**
 * @param {import("../model/dividends.model").Dividends} data
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findOrCreate = async (data, trx, find) => {
    return dividendsModel.findOrCreate(data, trx, find);
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @param {import("../model/dividends.model").Dividends} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) => {
    return knex.transaction(async (trx) => {
        if (data.investmentId) {
            const [investment] = await investmentModel.findAll({ where: { id: data.investmentId } }, trx);
            if (!investment) {
                throw new NotFound({ code: "Dividends" });
            }
        }

        if (data.brokerId) {
            const [broker] = await brokerModel.findAll({ where: { id: data.brokerId } }, trx);
            if (!broker) {
                throw new NotFound({ code: "Dividends" });
            }
        }

        if (data.qnt && data.price) {
            data["total"] = Number(data.qnt) * Number(data.price);
        }

        return dividendsModel.update(where, data, trx);
    });
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