import { dividendsService } from "../../services";
import { format } from "date-fns";
import knex from "../../db";
import logger from "../../logger";
import dividendsType from "../../enum/dividendsType";

const name = "update-divideds";
const group = "day";
const schedule = "0 10 * * *";
const deadline = 180;

const command = async () => {
    const dividends = await dividendsService.findUpdateDivideds(format(new Date(), "yyyy-MM-dd"));
    await knex.transaction(async (trx) => {
        await Promise.all(dividends.map(async (dy) => {
            try {
                await dividendsService.update({id: dy.id}, {type: dividendsType.PAID}, trx);
                logger.info(`Auto PAID dividend, investment: ${dy.investment.name}`);
            } catch (error) {
                logger.error(`Faill to update dividend - error: ${error}`);
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