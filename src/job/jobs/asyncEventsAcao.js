import axios from "axios";
import cheerio from "cheerio";
import { investmentService, eventsService } from "../../services";
import knex from "../../db";
import categoryType from "../../enum/categoryType";
import logger from "../../logger";
import env from "../../env";
import { format } from "date-fns";
import { stringToDate } from "../../utils";

const name = "async-events-acao";
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
                        const events = JSON.parse($(".documents > .list").attr()["data-page"]);
                        await Promise.all(events.map(async(event) => {
                            if(event.status === 0){
                                try {
                                    await eventsService.findOrCreate({
                                        investmentId: investment.id,
                                        assetMainId: event.id,
                                        dateReference: format(stringToDate(event.dataReferencia, "dd/MM/yyyy","/"), "yyyy-MM-dd"),
                                        dateDelivery: format(stringToDate(event.dataEntrega, "dd/MM/yyyy","/"), "yyyy-MM-dd"),
                                        link: event.link,
                                        description: event.description,
                                    }, trx);
                                } catch (error) {
                                    if(error.code !== "ER_DUP_ENTRY"){
                                        logger.error(`Faill to async event investment: ${investment.name} - error: ${error}`); 
                                    }   
                                }
                            }
                         }));
                    }
                } catch (error) {
                    if(error.code !== "ER_DUP_ENTRY"){
                        logger.error(`Faill to async event investment: ${investment.name} - error: ${error}`); 
                    }    
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