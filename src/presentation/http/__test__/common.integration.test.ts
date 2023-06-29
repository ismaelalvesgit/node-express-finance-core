import { container } from "@di/container";
import { EWhereOperator } from "@helpers/ICommon";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

const chance = new Chance();
const { getApp } = container.resolve(App);

describe("Common Request Router", () => { 

    beforeEach(async()=>{
        await knex("product").del();
    });

    it("get data from cache middleware", async() => {
        const prefix = "/v1/category";
        const [id] = await knex("category").insert({
            name: chance.name()
        });
        const res1 = await request(getApp).get(`${prefix}/${id}`);
        const res2 = await request(getApp)
        .get(`${prefix}/${id}`)
        .expect(StatusCodes.OK);
        const timeRequestOne = Number(res1.header["x-response-time"].split("ms")[0]);
        const timeRequestTwo = Number(res2.header["x-response-time"].split("ms")[0]);
        expect(timeRequestOne).toBeGreaterThan(timeRequestTwo);
    });

    test.each([
        { 
            data: { name: "Raquel", quantity: 1, price: 10 }, 
            operator: EWhereOperator.Equal,
            atribute: "name",
            condition: "Raquel"
        },
        { 
            data: { name: "Ismael", quantity: 1, price: 10 }, 
            operator: EWhereOperator.NotEqual,
            atribute: "name",
            condition: "Raquel"
        },
        { 
            data: { name: "Raquel", quantity: 1, price: 10 }, 
            operator: EWhereOperator.GreaterThan,
            atribute: "price",
            condition: 5
        },
        { 
            data: { name: "Ismael", quantity: 1, price: 10 }, 
            operator: EWhereOperator.GreaterThanOrEqual,
            atribute: "price",
            condition: 10
        },
        { 
            data: { name: "Raquel", quantity: 1, price: 10 }, 
            operator: EWhereOperator.LessThan,
            atribute: "price",
            condition: 11
        },
        { 
            data: { name: "Ismael", quantity: 1, price: 10 }, 
            operator: EWhereOperator.LessThanOrEqual,
            atribute: "price",
            condition: 10
        },
        { 
            data: { name: "Raquel", quantity: 1, price: 10 }, 
            operator: EWhereOperator.Like,
            atribute: "name",
            condition: "quel"
        }
    ])("request query Data: $data, Operator: $operator, Atribute: $atribute, Condition: $condition", 
    async ({data, operator, atribute, condition}) =>{
        const { name, price, quantity } = data;
        const prefix = "/v1/product";
        const [ categoryId ] = await knex("category").insert({
            name: chance.name()
        });
        await knex("product").insert({
            name,
            categoryId,
            quantity,
            price
        });

        const res = await request(getApp)
        .get(`${prefix}?orderBy=name&orderByDescending=true&filterBy=${atribute} ${operator} ${condition}`)
        .set("cache-control", "no-cache");
        expect(res.body.items[0]).toHaveProperty("name");
        expect(res.body.items[0]).toHaveProperty("id");
        expect(res.body.items[0].name).toBe(name);
        expect(Number(res.body.items[0].quantity)).toBe(quantity);
        expect(Number(res.body.items[0].price)).toBe(price);
        expect(Number(res.body.items[0].categoryId)).toBe(categoryId);
    });
    
});