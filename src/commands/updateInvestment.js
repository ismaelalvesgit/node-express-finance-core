import { investmentService, iexcloundService } from "../services";
import { investService } from "../socket/services";
import { isAfter, parseISO } from "date-fns";
import knex from "../db";
import { Logger } from "../logger";
import { categoryIsBR, diffPercent, findBrapiQoute, parsePercent } from "../utils";

const name = "update-investment";
const group = "minute";
const schedule = "*/10 9-20 * * 1-5";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll();
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async (invest) => {
            try {
                const qoute = categoryIsBR(invest.category.name) ? await findBrapiQoute(invest.category.name, invest.name) : 
                    await iexcloundService.findQoute(invest.name);

                if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                    Logger.info(`Updating values investment: ${invest.name}`);
                    const currency = qoute.currency;
                    const priceAverage = invest.priceAverage ?? 0;
                    const longName = qoute.longName;
                    const logoUrl = qoute.logourl;
                    const priceDay = qoute.regularMarketPrice;
                    const priceDayHigh = qoute.regularMarketDayHigh;
                    const priceDayLow = qoute.regularMarketDayLow;
                    const changePercentDay = qoute.regularMarketChangePercent;
                    const volumeDay = qoute.regularMarketVolume;
                    const previousClosePrice = qoute.regularMarketPreviousClose ?? invest.previousClosePrice;
                    const variationDay = qoute.regularMarketChange?.toFixed(2);
                    const changePercentTotal = diffPercent(priceDay, priceAverage); 
                    const variationTotal = parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0);
                    await investmentService.update({ id: invest.id }, {
                        logoUrl,
                        longName,
                        priceDay,
                        priceDayHigh,
                        priceDayLow,
                        changePercentDay,
                        volumeDay,
                        previousClosePrice,
                        variationDay,
                        changePercentTotal,
                        variationTotal,
                        currency
                    }, trx);
                    await investService.sendNotification(Object.assign(invest, {
                        longName,
                        priceDay,
                        priceDayHigh,
                        priceDayLow,
                        changePercentDay,
                        volumeDay,
                        previousClosePrice,
                        variationDay,
                        changePercentTotal,
                        variationTotal,
                        currency,
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