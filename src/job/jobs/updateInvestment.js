import { investmentService, brapiService, iexcloundService } from "../../services";
import { investService } from "../../socket/services";
import { isAfter, parseISO } from "date-fns";
import knex from "../../db";
import logger from "../../logger";
import { categoryIsBR, diffPercent, parseDecimalValue, parseFloatValue, parsePercent } from "../../utils";

const name = "update-investment";
const group = "minute";
const schedule = "*/5 9-20 * * 1-5";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll();
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async (invest) => {
            try {
                const qoute = categoryIsBR(invest.category.name) ? await brapiService.findQoute(invest.name) : 
                    await iexcloundService.findQoute(invest.name);

                if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                    logger.info(`Updating values investment: ${invest.name}`);
                    const priceAverage = parseFloatValue(invest.priceAverage ?? 0);
                    const longName = qoute.longName;
                    const logoUrl = qoute.logourl;
                    const priceDay = parseDecimalValue(qoute.regularMarketPrice);
                    const priceDayHigh = parseDecimalValue(qoute.regularMarketDayHigh);
                    const priceDayLow = parseDecimalValue(qoute.regularMarketDayLow);
                    const changePercentDay = qoute.regularMarketChangePercent;
                    const volumeDay = parseDecimalValue(qoute.regularMarketVolume);
                    const previousClosePrice = parseDecimalValue(qoute.regularMarketDayLow);
                    const variationDay = parseDecimalValue(parsePercent(changePercentDay, parseFloatValue(priceDay)));
                    const changePercentTotal = diffPercent(parseFloatValue(priceDay), priceAverage); 
                    const variationTotal = parseDecimalValue(parsePercent(changePercentTotal, priceAverage) * Number(invest.qnt ?? 0));
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
                        variationTotal
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
                        updatedAt: new Date()
                    }));
                }
            } catch (error) {
                logger.error(`Faill to update investment: ${invest.name} - error: ${error}`);
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