import axios from "axios";
import cheerio from "cheerio";
import { dividendsService, investmentService, transactionService } from "../../services";
import knex from "../../db";
import logger from "../../logger";
import { parseDateFiis, formatAmount, parseDecimalValues } from "../../utils";

const name = "async-divideds-fiis";
const group = "day";
const schedule = "0 10 * * *";
const deadline = 180;

const command = async () => {
    const investments = await investmentService.findAll();
    await knex.transaction(async (trx) => {
        await Promise.all(investments.map(async(investment)=>{
            try {
                const { data } = await axios.default.get(`https://fiis.com.br/${investment.name.toLowerCase()}/`);
                if(data){
                    const $ = cheerio.load(data);
                    const extract = {
                        dateBasis: parseDateFiis($("#last-revenues--table > tbody td:eq(0)").text()),
                        dueDate: parseDateFiis($("#last-revenues--table > tbody td:eq(1)").text()),
                        priceBasis: parseDecimalValues(formatAmount($("#last-revenues--table > tbody td:eq(2)").text()), 1),
                        dy: $("#last-revenues--table > tbody td:eq(3)").text(),
                        price: parseDecimalValues(formatAmount($("#last-revenues--table > tbody td:eq(4)").text()), 1),
                    };
                    
                    const { qnt } = await transactionService.findAllDividensByMonth({investmentId: investment.id}, extract.dateBasis, trx);

                    if(qnt > 0 && extract.dueDate && extract.price){
                        await dividendsService.findOrCreate({
                            investmentId: investment.id,
                            dueDate: extract.dueDate,
                            price: extract.price,
                            qnt,
                            total: qnt * extract.price,
                        }, trx);

                        logger.info(`Auto created dividend, investment: ${investment.name}`);
                    }
                }
            } catch (error) {
                logger.error(`Faill to async dividend investment: ${investment.name} - error: ${error}`); 
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