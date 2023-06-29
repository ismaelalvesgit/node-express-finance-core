import { ICategory } from "@domain/category/types/ICategory";
import { IEntity } from "@helpers/ICommon";

export interface IProduct extends IEntity {
    name: string
    imageUrl: string
    description: string
    category: ICategory
    categoryId: number
    price: number
    quantity: number
}