import { io } from "../../app";
import { Logger } from "../../logger";

/**
 * 
 * @param {Object} data 
 */
 export const sendNotification = async (channel, data)=>{
    if(data){
        io.emit(channel, data);
        Logger.info(`Send updates to customers: ${JSON.stringify(data)}`);
    }
};