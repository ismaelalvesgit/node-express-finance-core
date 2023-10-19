import { container } from "@di/container";
import { EWhereOperator } from "@helpers/ICommon";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { ECategoryType } from "@domain/category/types/ICategory";
import { GeneratorMock } from "@test/generator.mock";

const chance = new Chance();
const { getApp } = container.resolve(App);

describe("Common Request Router", () => { 

    beforeEach(async()=>{
        await GeneratorMock.clearTable(["investment", "category"]);
    });

    it("request docs", async() => {
        const res = await request(getApp)
        .get("/v1/docs")
        .expect(StatusCodes.MOVED_PERMANENTLY);
        expect(res.text.length).toBeGreaterThan(0);
    });

    it("request system healthcheck", async() => {
        const res = await request(getApp)
        .get("/v1/system/healthcheck")
        .expect(StatusCodes.OK);
        expect(res.body.length).toBe(undefined);
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
            data: { name: "VISC11", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.Equal,
            atribute: "name",
            condition: "VISC11"
        },
        { 
            data: { name: "BBSE3", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.NotEqual,
            atribute: "name",
            condition: "VISC11"
        },
        { 
            data: { name: "VISC11", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.GreaterThan,
            atribute: "balance",
            condition: 5
        },
        { 
            data: { name: "BBSE3", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.GreaterThanOrEqual,
            atribute: "balance",
            condition: 10
        },
        { 
            data: { name: "VISC11", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.LessThan,
            atribute: "balance",
            condition: 11
        },
        { 
            data: { name: "BBSE3", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.LessThanOrEqual,
            atribute: "balance",
            condition: 10
        },
        { 
            data: { name: "VISC11", category: ECategoryType.FIIS, balance: 10 }, 
            operator: EWhereOperator.Like,
            atribute: "name",
            condition: "VISC"
        }
    ])("request query Data: $data, Operator: $operator, Atribute: $atribute, Condition: $condition", 
    async ({data, operator, atribute, condition}) =>{
        const { name, category, balance } = data;
        const prefix = "/v1/investment";
        const [ categoryId ] = await knex("category").insert({
            name: category
        });
        await knex("investment").insert({
            name,
            categoryId,
            balance
        });

        const res = await request(getApp)
        .get(`${prefix}?orderBy=name&orderByDescending=true&filterBy=${atribute} ${operator} ${condition}`)
        .set("cache-control", "no-cache");
        expect(res.body.items[0]).toHaveProperty("name");
        expect(res.body.items[0]).toHaveProperty("id");
        expect(res.body.items[0].name).toBe(name);
        expect(Number(res.body.items[0].categoryId)).toBe(categoryId);
    });
    
});