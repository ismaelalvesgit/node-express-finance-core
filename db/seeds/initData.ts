import { Knex } from "knex";
import Chance from "chance"
import { ICategory } from "@domain/category/types/ICategory";
import { IProduct } from "@domain/product/types/IProduct";

const chance = new Chance()

const generateCategory = (quantity: number) => {
    const data: Partial<ICategory>[] = []
    for (let i = 0; i < quantity; i++) {
        data.push({
            name: chance.name(),
            imageUrl: chance.url()
        })
    }
    return data
}

const generateProduct = (quantity: number) => {
    const data: Partial<IProduct>[] = []
    for (let i = 0; i < quantity; i++) {
        data.push({
            name: chance.name(),
            description: chance.company(),
            imageUrl: chance.url(),
            quantity: chance.integer({min: 1, max: 10}),
            price: chance.integer({min: 10, max: 100})
        })
    }
    return data
}

export async function seed(knex: Knex) {
    const categoryCount = 3
    const products = generateProduct(3)
    const categorys = generateCategory(categoryCount)

    return knex.transaction(async (trx) => {

        await Promise.all(categorys.map(async(item)=>{
            await knex("category").insert(item).transacting(trx);
        }))

        await Promise.all(products.map(async(item)=>{
            const index = chance.integer({min: 0, max: categoryCount - 1})
            const category = await knex('category')
                .where({name: categorys[index].name})
                .first()
                .transacting(trx)
            await knex("product").insert({
                ...item,
                categoryId: category.id
            }).transacting(trx);
        }))
    });
};
