import { dividendsService, investmentService, transactionService,  iexcloundService} from "../../services";
import knex from "../../db";
import logger from "../../logger";
import env from "../../env";

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
                            const { qnt } = await transactionService.findAllDividensByMonth({investmentId: investment.id}, dividend.dateBasis, trx);
                            if(qnt > 0 && dividend.dueDate && dividend.price){
                                await dividendsService.findOrCreate({
                                    investmentId: investment.id,
                                    dueDate: dividend.dueDate,
                                    price: dividend.price,
                                    qnt,
                                    type: dividend.type,
                                    total: Number(qnt) * Number(dividend.price),
                                }, trx);
                                logger.info(`Auto created dividend, investment: ${investment.name}`); 
                            }
                        }));
                    }
                } catch (error) {
                    logger.error(`Faill to async dividend investment: ${investment.name} - error: ${error}`); 
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