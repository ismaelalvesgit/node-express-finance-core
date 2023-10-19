import { inject, injectable } from "tsyringe";
import { ISystemService } from "../types/ISystemService";
import { tokens } from "@di/tokens";
import { ISystemRepository } from "../types/ISystemRepository";

@injectable()
export default class SystemService implements ISystemService {

    constructor(
        @inject(tokens.SystemRepository)
        private systemRepository: ISystemRepository
    ) { }

    healthcheck(): Promise<void> {
        return this.systemRepository.healthcheck();
    }
}
