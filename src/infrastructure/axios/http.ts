import { AxiosLogger } from "@infrastructure/logger/logger";
import { IHttpAdapter, IHttpAdapterParams } from "@infrastructure/types/IHttpAdapter";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export default class HttpClient implements IHttpAdapter {
    protected readonly instance: AxiosInstance;

    constructor({
        baseURL, 
        headers, 
        params,
        auth
    }: IHttpAdapterParams) {
        this.instance = axios.create({
            baseURL,
            headers,
            params,
            auth
        });

        AxiosLogger.attachInterceptor.bind(AxiosLogger)(this.instance);
    }

    send(config: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
       return this.instance.request(config);
    } 

}