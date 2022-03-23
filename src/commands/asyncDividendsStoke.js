import { dividendsService, investmentService, transactionService,  iexcloundService} from "../services";
import knex from "../db";
import { Logger } from "../logger";
import env from "../env";
import { parsePercent } from "../utils";

const name = "async-divideds-stoke";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.iexclound){
        const investments = await investmentService.findStokeAll();
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async(investment)=>{
                try {
                    const { usage } = await iexcloundService.getCreditUsage();
                    if(usage){
                        const dividends = await iexcloundService.findDividens(investment.name.toUpperCase());
                        await Promise.all(dividends.map(async(dividend)=>{
                            const transactions = await transactionService.findAllDividensByMonth({investmentId: investment.id}, dividend.dateBasis, trx);
                            if(dividend.dueDate && dividend.price){
                                await Promise.all(transactions.map(async(transaction)=>{
                                    const { qnt, broker: { id: brokerId } } = transaction;
                                    const total = Number(qnt) * Number(dividend.price);
                                    await dividendsService.findOrCreate({
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis: dividend.dateBasis,
                                        dueDate: dividend.dueDate,
                                        price: dividend.price,
                                        qnt,
                                        type: dividend.type,
                                        total,
                                        fees: parsePercent(env.system.fees.outsidePercent, total),
                                        currency: dividend.currency
                                    }, trx, {
                                        investmentId: investment.id,
                                        brokerId,
                                        dateBasis: dividend.dateBasis,
                                        dueDate: dividend.dueDate,
                                        type: dividend.type,
                                    });
                                    Logger.info(`Auto created dividend, investment: ${investment.name}, broker: ${transaction.broker.name}`);
                                }));
                            }
                        }));
                    }
                } catch (error) {
                    Logger.error(`Faill to async dividend investment: ${investment.name} - error: ${error}`); 
                }
            }));
        });
    }
    
    return `Execute ${name} done`;
};

export {
    command,
    name,
    group,
    schedule,
    deadline,
};