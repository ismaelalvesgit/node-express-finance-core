import * as brokerModel from "../model/broker.model";

/**
 * @param {import("../model/contato.model").Broker} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where) =>{
    return brokerModel.findAll(where);
};

/**
 * @param {import("../model/broker.model").Broker} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return brokerModel.create(data);
};

/**
 * @param {import("../model/broker.model").Broker} where 
 * @param {import("../model/broker.model").Broker} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return brokerModel.update(where, data);
};

/**
 * @param {import("../model/broker.model").Broker} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return brokerModel.del(where);
};