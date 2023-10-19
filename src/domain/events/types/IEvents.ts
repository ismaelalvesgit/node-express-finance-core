import { IInvestment } from "@domain/investment/types/IInvestiment";
import { IEntity } from "@helpers/ICommon";

export const EventSelect = [
    "id",
    "dateReference",
    "dateDelivery",
    "link",
    "description",
    "createdAt",
    "updatedAt",
];

export interface IEvents extends IEntity {
    dateReference: Date
    dateDelivery: Date
    investmentId: number
    investment: IInvestment
    link: string
    description: string
}