import { IEmailAdapterParams, IEmailAdapterReponse } from "@infrastructure/types/IEmailAdapter";
import { AxiosResponse } from "axios";

export interface ISystemService {
    healthcheck(): Promise<void>
    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>>
}