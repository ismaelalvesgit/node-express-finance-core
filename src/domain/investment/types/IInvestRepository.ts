import { ITickerSearch } from "./IInvest";

export interface IInvestRepository { 
    searchSymbol(ticker: string): Promise<ITickerSearch[]>
}