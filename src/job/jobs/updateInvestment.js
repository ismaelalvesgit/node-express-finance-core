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
                    const price = parseDecimalValues(qoute.price);
                    const priceDayHigh = parseDecimalValues(qoute.priceDayHigh);
                    const priceDayLow = parseDecimalValues(qoute.priceDayLow);

                    await investmentService.update({ id: invest.id }, {
                        price,
                        priceDayHigh,
                        priceDayLow
                    }, trx);
                    await investService.sendNotification(Object.assign(invest, {
                        price,
                        priceDayHigh,
                        priceDayLow,
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