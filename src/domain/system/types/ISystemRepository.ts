import { AxiosResponse } from "axios";
import { IEmailAdapterParams, IEmailAdapterReponse } from "@infrastructure/types/IEmailAdapter";

export interface ISystemRepository {
    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>>
    healthcheck(): Promise<void>
}