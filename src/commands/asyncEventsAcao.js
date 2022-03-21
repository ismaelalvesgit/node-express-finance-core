import axios from "axios";
import { investmentService, eventsService } from "../services";
import knex from "../db";
import categoryType from "../enum/categoryType";
import { Logger } from "../logger";
import env from "../env";
import FormData from "form-data";

const name = "async-events-acao";
const group = "day";
const schedule = "0 10 * * 1-5";
const deadline = 180;

const command = async () => {
    if(env.yieldapi){
        const investments = await investmentService.findAll({"category.name": categoryType.ACAO});
        await knex.transaction(async (trx) => {
            await Promise.all(investments.map(async(investment)=>{
                try {
                    const formData = new FormData();
                    formData.append("year", new Date().getFullYear());
                    formData.append("code", investment.name);
                    const { data } = await axios.post(`${env.yieldapi}/acao/getassetreports`, formData, {
                        headers: formData.getHeaders()
                    });

                    if(data.data){
                        await Promise.all(data.data.map(async(event) => {
                            try {
                                const check = await eventsService.findOne({
                                    investmentId: investment.id,
                                    link: event.linkPdf
                                }, trx);

                                if(!check){
                                    await eventsService.create({
                                        investmentId: investment.id,
                                        assetMainId: new Date().getTime(),
                                        dateReference: event.dataReferencia,
                                        dateDelivery: new Date(),
                                        link: event.linkPdf,
                                        description: event.assunto || event.tipo,
                                    }, trx);
                                    Logger.info(`Auto created event, investment: ${investment.name}`);
                                }
                            } catch (error) {
                                if(error.code !== "ER_DUP_ENTRY"){
                                    Logger.error(`Faill to async event investment: ${investment.name} - error: ${error}`); 
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