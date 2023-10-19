import { inject, injectable } from "tsyringe";
import { IBrapiRepository } from "../types/IBrapiRepository";
import { ECategoryType } from "@domain/category/types/ICategory";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { IHttpAdapter } from "@infrastructure/types/IHttpAdapter";
import HttpClient from "@infrastructure/axios/http";
import { IQuoteBrapi, IQuoteCoinBrapi } from "../types/IBrapi";
import { InternalServer } from "@infrastructure/exceptions/errorException";

@injectable()
export default class BrapiRepository implements IBrapiRepository {

    private brapi: IHttpAdapter;

    constructor(
        @inject(tokens.Config)
        private config: Config
    ) {
        this.brapi = new HttpClient({
            baseURL: this.config.get().backend.brapi
        });
    }

    async searchQoute(symbol: string): Promise<IQuoteBrapi> {
        const { data } = await this.brapi.send<{stocks: IQuoteBrapi}>({
            url: "/available",
            params: {
                search: symbol
            }
        });
        return data.stocks;
    }

    async getQoute(symbol: string, category: ECategoryType): Promise<IQuoteBrapi> {
        if(category === ECategoryType.CRIPTOMOEDA){
            return this.getQouteCoin(symbol);
        }
        return this.getQouteStock(symbol);
    }

    async getQouteStock(symbol: string): Promise<IQuoteBrapi> {
        const { data } = await this.brapi.send<{results: IQuoteBrapi[]}>({
            url: `/quote/${symbol.toLocaleUpperCase()}?fundamental=true`,
        });
        return data.results[0];
    }

    async getQouteCoin(symbol: string): Promise<IQuoteBrapi> {
        const { data } = await this.brapi.send<{coins: IQuoteCoinBrapi[]}>({
            url: "/v2/crypto",
            params: {
                coin: symbol,
                currency: "BRL"
            }
        });
        const quote = this.formatCoinToQuote(data.coins)[0];
        if(!quote.regularMarketPrice) throw new InternalServer("Failed to get coin price");
        
        return quote;
    }

    private formatCoinToQuote(coins: IQuoteCoinBrapi[]): IQuoteBrapi[]{
        return coins.map((coin)=>{
            return {
                symbol: coin.coin,
                longName: coin.coinName,
                logourl: coin.coinImageUrl,
                currency: coin.currency,
                currencyRateFromUSD: coin.currencyRateFromUSD,
                regularMarketPrice: coin.regularMarketPrice,
                regularMarketDayHigh: coin.regularMarketDayHigh,
                regularMarketDayLow: coin.regularMarketDayLow,
                regularMarketDayRange: coin.regularMarketDayRange,
                regularMarketChange: coin.regularMarketChange,
                regularMarketChangePercent: coin.regularMarketChangePercent,
                marketCap: coin.marketCap,
                regularMarketVolume: coin.regularMarketVolume,
                regularMarketTime: new Date(Number(coin.regularMarketTime) * 1000),
            } as IQuoteBrapi;
        });
    }

}
