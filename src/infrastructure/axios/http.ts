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

    send<IEntity>(config: AxiosRequestConfig<IEntity>): Promise<AxiosResponse<IEntity, IEntity>> {
       return this.instance.request(config);
    } 

}