import { AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders, AxiosBasicCredentials } from "axios";

export interface IHttpAdapterParams {
    baseURL?: string
    headers?: AxiosRequestHeaders
    params?: unknown
    auth?: AxiosBasicCredentials  
}

export interface IHttpAdapter { 
    send<IEntity>(config: AxiosRequestConfig<IEntity>): Promise<AxiosResponse<IEntity>>
}