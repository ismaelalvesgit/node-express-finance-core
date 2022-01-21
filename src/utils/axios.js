import axios from "axios";
import env from "../env";
import logger from "../logger";
import { v4 as uuidv4 } from "uuid";

const instance = axios.create({
    baseURL: env.brapi,
    headers: {
        id:  uuidv4()
    }
});

instance.interceptors.request.use(resquest =>{
    return resquest;
});

instance.interceptors.response.use(response =>{
    logger.axiosLogger.write(response);
    return response;
});

/**
 * 
 * @param {import('axios').AxiosRequestConfig} config 
 * @returns { Promise<AxiosResponse<any>> }
 */
export default (config)=>{
    return instance.request(config);
};