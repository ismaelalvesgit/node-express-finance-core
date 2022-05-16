import { investmentService, iexcloundService } from "../services";
import knex from "../db";
import { Logger } from "../logger";
import { categoryIsBR, findBrapiQoute} from "../utils";

const name = "update-last-price";
const group = "day";
const schedule = "40 9 * * 1-5";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll();
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async (invest) => {
            try {
                const qoute = categoryIsBR(invest.category.name) ? await findBrapiQoute(invest.category.name, invest.name) : 
                    await iexcloundService.findQoute(invest.name);

                Logger.info(`Updating last price investment: ${invest.name}`);
                const previousClosePrice = qoute.regularMarketPrice;
                await investmentService.update({ id: invest.id }, {
                    previousClosePrice
                }, trx);
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