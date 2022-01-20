import categoryType from "../../src/enum/categoryType";
import { broker } from "../localData";

/**
* @param {import('knex').Knex} knex
*/
exports.seed = async function (knex) {
  return await knex.transaction(async (trx) => {
    await knex("category").insert(Object.values(categoryType).map((data) => {
      return {
        name: data
      };
    })).transacting(trx);
    await knex("broker").insert(broker.map((data) => {
      return {
        name: data
      };
    })).transacting(trx);
  });
};
