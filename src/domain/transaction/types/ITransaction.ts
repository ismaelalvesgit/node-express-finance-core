import { IBroker } from "@domain/broker/types/IBroker";
import { ECategoryType } from "@domain/category/types/ICategory";
import { IInvestment } from "@domain/investment/types/IInvestiment";
import { IEntity } from "@helpers/ICommon";

export const TransactionSelect = [
    "id",
    "type",
    "negotiationDate",
    "brokerage",
    "fees",
    "taxes",
    "qnt",
    "price",
    "total",
    "createdAt",
    "updatedAt",
];

export enum ETransactionType {
    BUY = "BUY",
    SELL = "SELL",
    RENT = "RENT"
}

export interface ITransactionBrokerQntCount {
    broker: IBroker
    qnt: number
    currency: string
}

export interface ITransactionLastAveragePrice {
    quantity: number
    priceAverage: number
    balance: number
}

export enum ETransactionEventDirection {
    SPLIT = "SPLIT",
    GROUPING = "GROUPING",
}

export interface ITransactionEventQnt {
    investmentId: number
    quantity: number
    direction: ETransactionEventDirection
}

export interface ITransaction extends IEntity {
    type: ETransactionType
    negotiationDate: Date
    brokerage: number
    fees: number
    taxes: number
    qnt: number
    price: number
    total: number
    profit: number
    brokerId: number
    broker: IBroker
    investmentId: number
    investment: IInvestment
    category?: ECategoryType
}