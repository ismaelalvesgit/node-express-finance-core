import axios from "axios";
import cheerio from "cheerio";
import { dividendsService, investmentService, transactionService } from "../../services";
import knex from "../../db";
import categoryType from "../../enum/categoryType";
import logger from "../../logger";
import { stringToDate, formatAmount, parseDecimalValue, parseStringToDividendType } from "../../utils";
import { format } from "date-fns";
import env from "../../env";

const name = "async-divideds-acao";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.yieldapi){
        const investments = await investmentService.findAll(null, {"category.name": categoryType.ACAO});
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async(investment)=>{
                try {
                    const { data } = await axios.default.get(`${env.yieldapi}/acoes/${investment.name.toLowerCase()}`);
                    if(data){
                        const $ = cheerio.load(data);
                        for (let i = 0; i < 4; i++) {
                            const temp = $(`table tr:eq(${i + 1})`).text().split(/\n/);
    
                            const extract = {
                                type: parseStringToDividendType(temp[1]),
                                dateBasis: format(stringToDate(temp[2], "dd/MM/yyyy","/"), "yyyy-MM-dd"),
                                dueDate: format(stringToDate(temp[3], "dd/MM/yyyy","/"), "yyyy-MM-dd"),
                                price: parseDecimalValue(formatAmount(temp[4]), 1),
                            };
                            
                            const { qnt } = await transactionService.findAllDividensByMonth({investmentId: investment.id}, extract.dateBasis, trx);

                            if(qnt > 0 && extract.dueDate && extract.price){
                                await dividendsService.findOrCreate({
                                    investmentId: investment.id,
                                    dateBasis: extract.dateBasis,
                                    dueDate: extract.dueDate,
                                    price: extract.price,
                                    qnt,
                                    type: extract.type,
                                    total: Number(qnt) * Number(extract.price),
                                }, trx);
                                logger.info(`Auto created dividend, investment: ${investment.name}`);
                            }
                        }  
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