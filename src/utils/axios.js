import axios from "axios";
import logger from "../logger";
import { v4 as uuidv4 } from "uuid";

export default class HttpAdapter {

    /** @type { import ('axios').AxiosInstance} */
    instance

    constructor({
        baseUrl, 
        headers = {}, 
        params = {}
    }){
        this.instance = axios.create({
            baseURL: baseUrl,
            headers: Object.assign(headers, {
                id:  uuidv4()
            }),
            params
        });

        this.instance.interceptors.request.use(resquest =>{
            return resquest;
        });
        
        this.instance.interceptors.response.use(response =>{
            logger.axiosLogger.write(response);
            return response;
        });
    }

    /**
     * 
     * @param {import('axios').AxiosRequestConfig} config 
     * @returns { Promise<AxiosResponse<any>> }
     */
    send(config){
        return this.instance.request(config);
    }
}