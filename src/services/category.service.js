import * as categoryModel from "../model/category.model";

/**
 * @param {import("../model/contato.model").Category} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAll = (where, sortBy, orderBy, limit) =>{
    return categoryModel.findAll({where, sortBy, orderBy, limit});
};

/**
 * @param {import("../model/category.model").Category} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const create = (data) =>{
    return categoryModel.create(data);
};

/**
 * @param {import("../model/category.model").Category} where 
 * @param {import("../model/category.model").Category} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const update = (where, data) =>{
    return categoryModel.update(where, data);
};

/**
 * @param {import("../model/category.model").Category} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) =>{
    return categoryModel.del(where);
};