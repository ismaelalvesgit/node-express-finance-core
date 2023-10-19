import { ECategoryType } from "@domain/category/types/ICategory";
import { IQuoteBrapi } from "./IBrapi";

export interface IBrapiRepository {
    getQouteCoin(symbol: string): Promise<IQuoteBrapi>
    getQouteStock(symbol: string): Promise<IQuoteBrapi>
    getQoute(symbol: string, category: ECategoryType): Promise<IQuoteBrapi>
    searchQoute(symbol: string): Promise<IQuoteBrapi>
}