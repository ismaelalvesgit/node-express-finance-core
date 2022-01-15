import { io } from "../../app";
import logger from "../../logger";
const BASE = "investment";

/**
 * 
 * @param {import('../../model/investment.model').Investment} investment 
 */
 export const sendNotification = async (investment)=>{
    if(investment){
        io.emit(`/update-${BASE}`, investment);
        logger.info(`Send updates to customers investment: ${investment.name}`)
    }
};