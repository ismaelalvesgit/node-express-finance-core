import { ICategory } from "@domain/category/types/ICategory";
import { IEntity } from "@helpers/ICommon";

export const InvestmentSelect = [
    "id",
    "name",
    "longName",
    "logoUrl",
    "balance",
    "currency",
    "sector",
    "volumeDay",
    "previousClosePrice",
    "changePercentDay",
    "variationDay",
    "changePercentTotal",
    "variationTotal",
    "priceDay",
    "priceDayHigh",
    "priceDayLow",
    "createdAt",
    "updatedAt",
];

export interface IInvestmentBalanceSync {
    id: number
    name: string
    balance: number
    asyncBalance: number
}

export interface IInvestment extends IEntity {
    name: string
    longName: string
    logoUrl: string
    balance: number
    priceAverage: number
    qnt: number
    tradingAmount: number
    percent: number
    percentCategory: number
    currency: string
    sector: string
    volumeDay: number
    previousClosePrice: number
    variationDay: number
    variationDayTotal: number
    variationTotal: number
    changePercentDay: number
    changePercentTotal: number
    priceDay: number
    priceDayHigh: number
    priceDayLow: number
    categoryId: number
    category: ICategory
}