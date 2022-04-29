import { investmentService, brapiService } from "../services";
import { investService } from "../socket/services";
import { isAfter, parseISO, subMinutes } from "date-fns";
import knex from "../db";
import { Logger } from "../logger";
import { diffPercent, getPercent, parsePercent } from "../utils";
import categoryType from "../enum/categoryType";

const name = "update-crypto-price";
const group = "second";
const schedule = "*/30 * * * * *";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll({"category.name": categoryType.CRIPTOMOEDA});
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async (invest) => {
            try {
                const qoute = await brapiService.findQouteCoin2(invest.name);

                if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                    Logger.info(`Updating values investment: ${invest.name}`);
                    const priceAverage = invest.priceAverage ?? 0;
                    const priceDay =  Number(qoute.regularMarketPrice || 0);
                    const priceDayHigh = qoute.regularMarketDayHigh;
                    const priceDayLow = qoute.regularMarketDayLow;
                    const volumeDay = qoute.regularMarketVolume;
                    const previousClosePrice = Number(qoute.regularMarketPreviousClose || 0);
                    const variationDay = previousClosePrice - priceDay;
                    const changePercentDay = getPercent(variationDay, priceDay);
                    const changePercentTotal = diffPercent(priceDay, priceAverage); 
                    const variationTotal = parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                    if(isAfter(subMinutes(parseISO(qoute.regularMarketTime), 2), parseISO(invest.updatedAt))){
                        await investmentService.update({ id: invest.id }, {
                            priceDay,
                            priceDayHigh,
                            priceDayLow,
                            volumeDay,
                            previousClosePrice,
                            variationDay,
                            changePercentDay,
                            changePercentTotal,
                            variationTotal
                        }, trx);
                    }
                    await investService.sendNotification(Object.assign(invest, {
                        priceDay,
                        priceDayHigh,
                        priceDayLow,
                        volumeDay,
                        previousClosePrice,
                        variationDay,
                        changePercentDay,
                        changePercentTotal,
                        variationTotal,
                        updatedAt: new Date()
                    }));
                }
            } catch (error) {
                Logger.error(`Faill to update investment: ${invest.name} - error: ${error}`);
            }
        }));
    });
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};