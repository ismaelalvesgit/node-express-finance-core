import { inject, injectable } from "tsyringe";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import { IInvestRepository } from "../types/IInvestRepository";
import HttpClient from "@infrastructure/axios/http";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { EIndexType, IIndex, IIndexerParams, IIndexerResponse, IIndexParams, ITickerSearch } from "../types/IInvest";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "@infrastructure/logger/logger";
import FormData from "form-data";

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
    
    async indexer(params: IIndexerParams): Promise<IIndexerResponse> {
        try {
   
            const { data } = await this.http.send<IIndexerResponse>({
                url: "/indexer/getvalue",
                method: "GET",
                params: {
                    name: params.type,
                    type: params.period
                }
            });

            return data;
        } catch (error) {
            Logger.error(`Failed to get indexer ${params.type} period ${params.period}, Error: ${error}`);
            throw error;
        } 
    }

    async index(params: IIndexParams): Promise<IIndex[]> {
        try {
            const url = params.type !== EIndexType.SP500 ? "/indice/tickerprice" : "/indiceexterior/tickerprice";
            const formData = new FormData();
            formData.append("ticker", params.type);
            formData.append("type", params.period.toString());
            if(params.type !== EIndexType.SP500){
                formData.append("currences[]", "1");
            }

            const { data } = await this.http.send<object>({
                url,
                method: "POST",
                data: formData,
                headers: formData.getHeaders()
            });
    
            return params.type !== EIndexType.SP500 ? data[0].prices : data as IIndex[];
        } catch (error) {
            Logger.error(`Failed to get index ${params.type} period ${params.period}, Error: ${error}`);
            throw error;
        } 
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