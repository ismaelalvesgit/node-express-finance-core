import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

const chance = new Chance();
const { getApp } = container.resolve(App);
const prefix = "/v1/category";

describe("Category Router", () => {

    describe("find by id", ()=>{
        it("should return status code 200 with success from cache", async() => {
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

        it("should return status code 200 with success", async() => {
            const [id] = await knex("category").insert({
                name: chance.name()
            });

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
    
    describe("find all", ()=>{
        it("should return status code 200 with success", async() => {
            await knex("category").insert({
                name: chance.name()
            });

            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("name");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await knex("category").del();

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("delete", ()=>{
        it("should return status code 204 with success", async() => {
            const [id] = await knex("category").insert({
                name: chance.name()
            });

            await request(getApp)
            .delete(`${prefix}/${id}`)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("create", ()=>{
        it("should return status code 201 with success", async() => {
            await request(getApp)
            .post(`${prefix}`)
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.CREATED);
        });
        
        it("should return status code 400 duplicated data", async() => {
            const name = chance.name();
            await knex("category").insert({
                name
            });

            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                name
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toContain("Valor único já cadastrado");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("name e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("name is required");
        });
    });
    
    describe("createAsync", ()=>{
        it("should return status code 201 with success", async() => {
            await request(getApp)
            .post(`${prefix}/async`)
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.OK);
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .post(`${prefix}/async`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("name e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .post(`${prefix}/async`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("name is required");
        });
    });
    
    describe("update", ()=>{
        it("should return status code 200 with success", async() => {
            const [id] = await knex("category").insert({
                name: chance.name()
            });

            await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.ACCEPTED);
        });
        
        it("should return status code 400 duplicated data", async() => {
            const name = chance.name();
            await knex("category").insert({
                name
            });
            const [id] =  await knex("category").insert({
                name: chance.name()
            });

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                name
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toContain("Valor único já cadastrado");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("\"body\" deve possuir pelo menos 1 key");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("\"body\" must have at least 1 key");
        });
    });
});