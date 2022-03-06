import { io } from "../../app";
import logger from "../../logger";
const BASE = "investment";

/**
 * 
 * @param {import('../../services/currencyapi.service').Currency} currency 
 */
 export const sendNotification = async (currency)=>{
    if(currency){
        io.emit(`/update-${BASE}`, currency);
        logger.info("Send updates to customers currency");
    }
};