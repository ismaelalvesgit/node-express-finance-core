import axios from "axios";
import env from "../env";
import logger from "../logger";

const instance = axios.create({
    baseURL: env.brapi
});

instance.interceptors.request.use(resquest =>{
    logger.info(resquest);
    return resquest;
});

instance.interceptors.response.use(response =>{
    logger.info(response);
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