import { IEntity } from "@helpers/ICommon";

export const BrokerSelect = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
];

export interface IBroker extends IEntity {
    name: string
}