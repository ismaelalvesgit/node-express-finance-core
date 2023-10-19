import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";

const chance = new Chance();
const { getApp } = container.resolve(App);
const prefix = "/v1/broker";

describe("Broker Router", () => {

    describe("Find By Id", ()=>{

        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.broker(1);

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("broker").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.broker(1);
            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("name");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await GeneratorMock.clearTable(["broker"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Delete", ()=>{
        it("should return status code 204 with success", async() => {
            const [{id}] = await GeneratorMock.broker(1);

            const res = await request(getApp)
            .delete(`${prefix}/${id}`)
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Create", ()=>{
        it("should return status code 201 with success", async() => {
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Broker criado com sucesso!!!");
        });
        
        it("should return status code 400 duplicated data", async() => {
            const [{name}] = await GeneratorMock.broker(1);
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
    
    describe("Update", ()=>{
        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.broker(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Broker atualizado com sucesso!!!");
        });
        
        it("should return status code 400 duplicated data", async() => {
            const [{id}, {name}] = await GeneratorMock.broker(2);
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
            expect(res.body.details[0].message).toBe("name e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("name is required");
        });
    });
});