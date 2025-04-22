import { IIndex, IIndexer, IIndexerParams, IIndexParams } from "@domain/investment/types/IInvest";
import { IBcbIndex, IBcbIndexParams, IBcbInflactionIndicator, IBcbNews } from "./IBcb";


export interface IBcbService {
    indexer(params: IIndexerParams): Promise<IIndexer>
    indexV2(params: IIndexParams): Promise<IIndex[]>
    index(params: IBcbIndexParams): Promise<IBcbIndex[]>
    inflactionIndicator(): Promise<IBcbInflactionIndicator>
    news(): Promise<IBcbNews[]>
}