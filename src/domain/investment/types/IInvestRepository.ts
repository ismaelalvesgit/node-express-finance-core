import { IIndex, IIndexerParams, IIndexerResponse, IIndexParams, ITickerSearch } from "./IInvest";

export interface IInvestRepository { 
    searchSymbol(ticker: string): Promise<ITickerSearch[]>
    index(params: IIndexParams): Promise<IIndex[]>
    indexer(params: IIndexerParams): Promise<IIndexerResponse>
}