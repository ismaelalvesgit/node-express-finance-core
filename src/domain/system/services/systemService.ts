import { inject, injectable } from "tsyringe";
import { ISystemService } from "../types/ISystemService";
import { tokens } from "@di/tokens";
import { ISystemRepository } from "../types/ISystemRepository";
import { IEmailAdapterParams } from "@infrastructure/types/IEmailAdapter";
import { AxiosResponse } from "axios";

@injectable()
export default class SystemService implements ISystemService {

    constructor(
        @inject(tokens.SystemRepository)
        private systemRepository: ISystemRepository
    ) { }

    sendEmailNotification(params: IEmailAdapterParams): Promise<AxiosResponse> {
        return this.systemRepository.sendEmailNotification(params);
    }  

    healthcheck(): Promise<void> {
        return this.systemRepository.healthcheck();
    }
}
