import { IBroker } from "@domain/broker/types/IBroker";
import { ICategory } from "@domain/category/types/ICategory";
import { IInvestment } from "@domain/investment/types/IInvestiment";
import { IEntity } from "@helpers/ICommon";

export const DividendsSelect = [
    "id",
    "status",
    "type",
    "dueDate",
    "dateBasis",
    "qnt",
    "price",
    "total",
    "fees",
    "currency",
    "createdAt",
    "updatedAt",
];

export enum EDividendsStatus {
    PROVISIONED = "PROVISIONED",
    PAID = "PAID",
}

export enum EDividendsType {
    DIVIDEND = "DIVIDEND",
    JCP = "JCP"
}

export interface IDividends extends IEntity {
    broker: IBroker
    brokerId: number
    investmentId: number
    investment: IInvestment
    status: EDividendsStatus
    type: EDividendsType
    dueDate: Date
    dateBasis: Date
    currency: string
    qnt: number
    fees: number
    price: number
    total: number
}

export interface IDividendsChangeStatus extends IDividends {
    category: ICategory
}