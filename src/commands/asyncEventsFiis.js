import axios from "axios";
import cheerio from "cheerio";
import { investmentService, eventsService } from "../services";
import knex from "../db";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import env from "../env";
import { format } from "date-fns";
import { stringToDate } from "../utils";

const name = "async-events-fiis";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.yieldapi){
        const investments = await investmentService.findAll({"category.name": categoryType.FIIS});
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async(investment)=>{
                try {
                    const { data } = await axios.get(`${env.yieldapi}/fundos-imobiliarios/${investment.name.toLowerCase()}`);
                    if(data){
                        const $ = cheerio.load(data);
                        const events = JSON.parse($(".documents > .list").attr()["data-page"]);
                        await Promise.all(events.map(async(event) => {
                            if(event.status === 0){
                                let dateReference = format(new Date(), "yyyy-MM-dd"); 
                                let dateDelivery = format(new Date(), "yyyy-MM-dd"); 
                                try {
                                    dateReference = format(stringToDate(event.dataReferencia, "dd/MM/yyyy","/"), "yyyy-MM-dd");
                                    dateDelivery = format(stringToDate(event.dataEntrega, "dd/MM/yyyy","/"), "yyyy-MM-dd");
                                // eslint-disable-next-line no-empty
                                } catch (error) {}

                                try {
                                    await eventsService.create({
                                        investmentId: investment.id,
                                        assetMainId: event.id,
                                        dateReference,
                                        dateDelivery,
                                        link: event.link,
                                        description: event.description,
                                    }, trx);
                                    Logger.info(`Auto created event, investment: ${investment.name}`);
                                } catch (error) {
                                    if(error.code !== "ER_DUP_ENTRY"){
                                        Logger.error(`Faill to async event investment: ${investment.name} - error: ${error}`); 
                                    }   
                                }
                            }
                         }));
                    }
                } catch (error) {
                    if(error.code !== "ER_DUP_ENTRY"){
                        Logger.error(`Faill to async event investment: ${investment.name} - error: ${error}`); 
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