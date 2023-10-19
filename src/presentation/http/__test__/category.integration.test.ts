import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";
const { getApp } = container.resolve(App);
const prefix = "/v1/category";

describe("Category Router", () => {

    describe("Find By Id", ()=>{
        it("should return status code 200 with success from cache", async() => {
            const [{ id }] = await GeneratorMock.category();
            const res1 = await request(getApp).get(`${prefix}/${id}`);
            const res2 = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            const timeRequestOne = Number(res1.header["x-response-time"].split("ms")[0]);
            const timeRequestTwo = Number(res2.header["x-response-time"].split("ms")[0]);
            expect(timeRequestOne).toBeGreaterThan(timeRequestTwo);
        });

        it("should return status code 200 with success", async() => {
            const [{ id }] = await GeneratorMock.category();

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("category").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.category();

            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("name");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            GeneratorMock.clearTable(["category"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
});