import * as dividendsModel from "../model/dividends.model";
import * as investmentModel from "../model/investment.model";
import * as brokerModel from "../model/broker.model";
import * as transactionModel from "../model/transaction.model";
import * as R from "ramda";
import knex from "../db";
import { NotFound } from "../utils/erro";
import { Logger } from "../logger";
import { format } from "date-fns";
import { categoryIsBR, parsePercent } from "../utils";
import dividendsStatus from "../enum/dividendsStatus";
import env from "../env";

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
export const create = (data) => {
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
export const findOrCreate = (data, trx, find) => {
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
 * @param {Object[]} data 
 * @param {import('../enum/dividendsType')} data.type
 * @param {number} data.investmentId
 * @param {Date} data.dueDate
 * @param {Date} data.dateBasis
 * @param {number} data.price
 * @param {number} data.fees
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const autoCreate = (data) => {
    return knex.transaction(async (trx) => {
        await Promise.all(data.map(async(items) => {
            const { investmentId, type, dateBasis, dueDate, price, fees } = items;
            const transactions = await transactionModel.getQntByBroker({
                where: { investmentId },
                date: dateBasis
            }, trx);
            await Promise.all(transactions.map(async(transaction)=>{
                const { qnt, broker: { id: brokerId }, currency } = transaction;
                const total = Number(qnt) * Number(price);
                const dividends = await dividendsModel.findOrCreate(R.reject(R.isNil, {
                    investmentId,
                    brokerId,
                    dateBasis,
                    dueDate,
                    price,
                    qnt,
                    type,
                    total,
                    fees: parsePercent(fees ?? 0, total),
                    currency
                }), trx, {
                    investmentId,
                    brokerId,
                    dateBasis,
                    dueDate,
                    type,
                });
                if(dividends && Number(qnt) !== Number(dividends.qnt)){
                    await dividendsModel.update(
                        { id: dividends.id }, 
                        { qnt, price }, 
                        trx
                    );
                }
                Logger.info(`Auto created dividend, ${JSON.stringify({ 
                    investmentId, 
                    broker: transaction.broker.name,                                        
                    dateBasis, 
                    dueDate, 
                    price
                })}`);
            }));
        }));
    });
};

/**
 * @param { Date } dueDate
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const autoPaid = (dueDate) => {
    return knex.transaction(async (trx) => {
        const dividends = await dividendsModel.findUpdateDivideds(format(dueDate, "yyyy-MM-dd"), trx);
        await Promise.all(dividends.map(async (dy) => {
            const { id, investment, broker, dateBasis, price, category: { name: categoryType } } = dy;
            try {
                const transactions = await transactionModel.getQntByBroker({
                    where:{investmentId: investment.id, brokerId: broker.id}, 
                    date: dateBasis}, 
                    trx
                );
                await Promise.all(transactions.map((transaction)=>{
                    let fees = 0;
                    if(!categoryIsBR(categoryType))
                        fees = env.system.fees.outsidePercent;
                    const { qnt } = transaction;
                    const total = Number(qnt) * Number(price);
                    return dividendsModel.update({id: id}, {
                        status: dividendsStatus.PAID,
                        qnt,
                        price,
                        total,
                        fees: parsePercent(fees, total)
                    }, trx);
                }));
                Logger.info(`Auto PAID dividend, investment: ${investment.name}, value: `);
            } catch (error) {
                Logger.error(`Faill to update dividend - error: ${error}`);
            }
        }));
    });
};

/**
 * @param {import("../model/dividends.model").Dividends} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const del = (where) => {
    return dividendsModel.del(where);
};