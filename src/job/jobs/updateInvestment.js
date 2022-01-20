import { investmentService, brapiService } from "../../services";
import { investService } from "../../socket/services";
import { isAfter, parseISO } from "date-fns";
import knex from "../../db";
import logger from "../../logger";
import { parseDecimalValues } from "../../utils";

const name = "update-investment";
const group = "minute";
const schedule = "*/5 * * * *";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll();
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async (invest) => {
            try {
                const qoute = await brapiService.findQoute(invest.name);
                if (isAfter(parseISO(qoute.regularMarketTime), parseISO(invest.updatedAt))) {
                    logger.info(`Updating values investment: ${invest.name}`);
                    const longName = qoute.longName;
                    const priceDay = parseDecimalValues(qoute.regularMarketPrice);
                    const priceDayHigh = parseDecimalValues(qoute.regularMarketDayHigh);
                    const priceDayLow = parseDecimalValues(qoute.regularMarketDayLow);
                    const changePercentDay = qoute.regularMarketChangePercent;
                    const volumeDay = parseDecimalValues(qoute.regularMarketVolume);
                    const previousClosePrice = parseDecimalValues(qoute.regularMarketDayLow);

                    await investmentService.update({ id: invest.id }, {
                        longName,
                        priceDay,
                        priceDayHigh,
                        priceDayLow,
                        changePercentDay,
                        volumeDay,
                        previousClosePrice,
                    }, trx);
                    await investService.sendNotification(Object.assign(invest, {
                        longName,
                        priceDay,
                        priceDayHigh,
                        priceDayLow,
                        changePercentDay,
                        volumeDay,
                        previousClosePrice,
                        updatedAt: new Date()
                    }));
                }
            } catch (error) {
                logger.error(`Faill to update investment - error: ${error}`);
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