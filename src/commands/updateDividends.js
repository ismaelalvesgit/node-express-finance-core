import { dividendsService, transactionService } from "../services";
import { format } from "date-fns";
import knex from "../db";
import logger from "../logger";
import dividendsStatus from "../enum/dividendsStatus";

const name = "update-divideds";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    const dividends = await dividendsService.findUpdateDivideds(format(new Date(), "yyyy-MM-dd"));
    await knex.transaction(async (trx) => {
        await Promise.all(dividends.map(async (dy) => {
            try {
                const transactions = await transactionService.findAllDividensByMonth({investmentId: dy.investment.id}, dy.dateBasis, trx);
                await Promise.all(transactions.map((transaction)=>{
                    const { qnt } = transaction;
                    return dividendsService.update({id: dy.id}, {
                        status: dividendsStatus.PAID,
                        qnt,
                        price: dy.price,
                    }, trx);
                }));
                logger.info(`Auto PAID dividend, investment: ${dy.investment.name}`);
            } catch (error) {
                logger.error(`Faill to update dividend - error: ${error}`);
            }
        }));
    });
    return `Execute ${name} done`;
};

command();

export {
    command,
    name,
    group,
    schedule,
    deadline,
};