import { investmentService, brapiService } from "../../services";
import { investService } from "../../socket/services";
import { isAfter, parseISO } from "date-fns";
import knex from "../../db";
import logger from "../../logger";

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
                    await investmentService.update({ id: invest.id }, {
                        regularMarketPrice: qoute.regularMarketPrice,
                        regularMarketDayHigh: qoute.regularMarketDayHigh,
                        regularMarketDayLow: qoute.regularMarketDayLow,
                    }, trx);
                    await investService.sendNotification(Object.assign(invest, {
                        regularMarketPrice: qoute.regularMarketPrice,
                        regularMarketDayHigh: qoute.regularMarketDayHigh,
                        regularMarketDayLow: qoute.regularMarketDayLow,
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