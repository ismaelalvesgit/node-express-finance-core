import axios from "axios";
import { AxiosLogger } from "../logger";
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

        AxiosLogger.attachInterceptor.bind(AxiosLogger)(this.instance);
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