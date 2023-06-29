import { AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders, AxiosBasicCredentials } from "axios";

export interface IHttpAdapterParams {
    baseURL?: string
    headers?: AxiosRequestHeaders
    params?: unknown
    auth?: AxiosBasicCredentials
}

export interface IHttpAdapter { 
    send(config: AxiosRequestConfig): Promise<AxiosResponse>
}