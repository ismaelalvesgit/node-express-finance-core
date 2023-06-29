import { inject, injectable } from "tsyringe";
import { ISystemRepository } from "../types/ISystemRepository";
import knex from "@infrastructure/knex/knex";
import { tokens } from "@di/tokens";
import { AxiosResponse } from "axios";
import EmailClient from "@infrastructure/email/email";
import { IEmailAdapterParams, IEmailAdapterReponse } from "@infrastructure/types/IEmailAdapter";

@injectable()
export default class SystemRepository implements ISystemRepository {

    constructor(
        @inject(tokens.EmailClient)
        private emailClient: EmailClient,
    ) {}

    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse<IEmailAdapterReponse>> {
        return this.emailClient.send(params);
    }

    healthcheck(): Promise<void> {
        return knex.raw("select 1+1 as result");
    }

}