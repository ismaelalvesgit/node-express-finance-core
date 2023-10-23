import { inject, injectable } from "tsyringe";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IInvestRepository } from "../types/IInvestRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { ITickerSearch } from "../types/IInvest";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "@infrastructure/logger/logger";

@injectable()
export default class InvestRepository implements IInvestRepository {

    private http: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.http = new HttpClient({
            baseURL: this.config.get().backend.invest,
            headers: {
                "User-Agent": uuidv4()
            }
        });
    }

    async searchSymbol(ticker: string): Promise<ITickerSearch[]> {
        try {
            const { data } = await this.http.send<ITickerSearch[]>({
                url: "/home/mainsearchquery",
                params: {
                    q: ticker
                }
            });
    
            return data;
        } catch (error) {
            Logger.error(`Failed to get search investment: ${ticker}, Error: ${error}`);
            throw error;
        } 
    }
}