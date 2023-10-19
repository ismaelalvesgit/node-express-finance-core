import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";
import { Config } from "@config/config";
import nock from "nock";
import { ECategoryType } from "@domain/category/types/ICategory";

const url = new Config().get().backend.brapi;
const { getApp } = container.resolve(App);
const requestMock = nock(url);
const prefix = "/v1/investment";

describe("Investment Router", () => {

    describe("Find By Id", ()=>{

        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.investment(1);

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("investment").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.investment(1);
            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("name");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await GeneratorMock.clearTable(["investment"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("name");
        });
    });
    
    describe("Delete", ()=>{
        it("should return status code 204 with success", async() => {
            const [{id}] = await GeneratorMock.investment(1);

            const res = await request(getApp)
            .delete(`${prefix}/${id}`)
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).not.toHaveProperty("name");
        });
        
        it("should return status code 400 not delete exist transactions", async() => {
            const [{investmentId}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .delete(`${prefix}/${investmentId}`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.message).toContain("Você não pode realizar essa operação pois possui transações em aberto 😅");
        });
    });
    
    describe("Create", ()=>{
        it("should return status code 201 with success", async() => {
            const name = "VISC11";
            requestMock.get(`/quote/${name}?fundamental=true`).reply(200, {results: []});
            const categorys = await GeneratorMock.category();
            const category = categorys.find((category) => category.name === ECategoryType.FIIS);
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                name: "VISC11",
                categoryId: category?.id
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Investimento cadastrado com sucesso!!! 😆");
        });
        
        it("should return status code 400 duplicated data", async() => {
            const [{name, categoryId}] = await GeneratorMock.investment(1);
            
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                name,
                categoryId
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.message).toContain("Valor único já cadastrado");
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
    
    describe("Batch Update", ()=>{
        it("should return status code 201 with success", async() => {
            const [{id}] = await GeneratorMock.investment(1);
            const res = await request(getApp)
            .put(`${prefix}/batch`)
            .send([
                {
                    id: id,
                    balance: 100,
                }
            ])
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Investimento atualizado com sucesso!!!");
        });
    });

    describe("Sync Balance", ()=>{
        it("should return status code 200 with success", async() => {
            const [{total, id}] = await GeneratorMock.transaction(1);
            await knex("transaction").update({total: Number(total) + 10}).where({id});
            
            const res = await request(getApp)
            .put(`${prefix}/syncBalance`)
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Investimento atualizado com sucesso!!!");
        });
    });
    
    describe("Update", ()=>{
        it("should return status code 200 with success", async() => {
            const [{id, categoryId}] = await GeneratorMock.investment(1);
            const name = "XPCA11";
            requestMock.get(`/quote/${name}?fundamental=true`).reply(200, {results: []});

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                name,
                categoryId,
                logoUrl: "http://favicon.svg"
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Investimento atualizado com sucesso!!!");
        });
        
        it("should return status code 400 duplicated data", async() => {
            const [{id}, {name}] = await GeneratorMock.investment(2);
            requestMock.get(`/quote/${name}?fundamental=true`).reply(200, {results: []});

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
            expect(res.body.details[0].message).toBe("\"body\" deve ter pelo menos 1 chave");
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