import * as eventsModel from "../model/events.model";
import * as investmentModel from "../model/investment.model";
import knex from "../db";
import { NotFound } from "../utils/erro";

/**
 * @param {import("../model/events.model").Events} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) => {
    return eventsModel.findAll({ where, sortBy, orderBy, limit });
};

/**
 * @param {import("../model/events.model").Events} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = async (data) => {
    return knex.transaction(async(trx)=>{
        const [ investment ] = await investmentModel.findAll({ where: { id: data.investmentId } }, trx);
        if (!investment) {
            throw new NotFound({ code: "Events" });
        }
        return eventsModel.create({
            ...data,
            total: data.qnt * data.price
        }, trx);
    });
};

/**
 * @param {import("../model/events.model").Events} data
 * @param {import('knex').Knex.Transaction} trx  
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findOrCreate = async (data, trx) => {
    return eventsModel.findOrCreate(data, trx);
 };

/**
 * @param {import("../model/events.model").Events} where 
 * @param {import("../model/events.model").Events} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) => {
    return eventsModel.update(where, data);
};

/**
 * @param {import("../model/events.model").Events} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) => {
    return knex.transaction(async (trx) => {
        return eventsModel.del(where, trx);
    });
};