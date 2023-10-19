import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";
import { ETransactionType } from "@domain/transaction/types/ITransaction";
import { ECategoryType } from "@domain/category/types/ICategory";
import { Config } from "@config/config";
import nock from "nock";

const chance = new Chance();
const { getApp } = container.resolve(App);
const prefix = "/v1/transaction";
const url = new Config().get().backend.brapi;
const requestMock = nock(url);

describe("Transaction Router", () => {

    describe("Find By Id", ()=>{

        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("investmentId");
            expect(res.body).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("transaction").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.transaction(1);
            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("investmentId");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await GeneratorMock.clearTable(["transaction"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Delete", ()=>{
        it("should return status code 204 with success", async() => {
            const [{id}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .delete(`${prefix}/${id}`)
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Create", ()=>{
        it("should return status code 201 with success Transaction type BUY", async() => {
            const name = "VISC11";
            requestMock.get(`/quote/${name}?fundamental=true`).reply(200, {results: []});
            const [[broker]] = await Promise.all([
                GeneratorMock.broker(1),
                GeneratorMock.category()
            ]);
            const qnt = 10;
            const price = chance.integer({min: 10, max: 15});

            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                negotiationDate: new Date(),
                type: ETransactionType.BUY,
                category: ECategoryType.FIIS,
                qnt,
                price,
                investment: name,
                brokerId: broker.id
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Transação realizada com sucesso!!! 😆");
        });
        
        it("should return status code 201 with success Transaction type SELL", async() => {
            const [{investment, brokerId, price}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                brokerId,
                negotiationDate: new Date(),
                type: ETransactionType.SELL,
                category: investment.category.name,
                qnt: 1,
                price: Number(price) - 5,
                investment: investment.name,
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Transação realizada com sucesso!!! 😆");
        });
       
        it("should return status code 400 with success Transaction type SELL", async() => {
            const [{investment, brokerId, price, qnt}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                brokerId,
                negotiationDate: new Date(),
                type: ETransactionType.SELL,
                category: investment.category.name,
                qnt: Number(qnt) * 2,
                price: Number(price) - 5,
                investment: investment.name,
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.message).toBe("Quantidade de cotas supera a quantidade cotas do investimento 😅");
        });
  
        it("should return status code 200 with success Transaction type SELL total qnt", async() => {
            const [{investment, brokerId, price, qnt}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                brokerId,
                qnt,
                negotiationDate: new Date(),
                type: ETransactionType.SELL,
                category: investment.category.name,
                price: Number(price) - 5,
                investment: investment.name,
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Transação realizada com sucesso!!! 😆");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investment e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investment is required");
        });
    });
    
    describe("Update", ()=>{
        it("should return status code 200 with success Transaction type BUY", async() => {
            const [{id, investment, brokerId, price}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                brokerId,
                investment: investment.name,
                type: ETransactionType.BUY,
                category: investment.category.name,
                negotiationDate: new Date(),
                qnt: 1,
                price: Number(price) - 5
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Atualização realizada com sucesso!!!");
        });

        it("should return status code 200 with success Transaction type SELL", async() => {
            const [{id, investment, brokerId, price}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                brokerId,
                investment: investment.name,
                type: ETransactionType.SELL,
                category: investment.category.name,
                negotiationDate: new Date(),
                qnt: 1,
                price: Number(price) - 5
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Atualização realizada com sucesso!!!");
        });
        
        it("should return status code 400 with success Transaction type SELL", async() => {
            const [{id, investment, brokerId, price, qnt}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                brokerId,
                investment: investment.name,
                type: ETransactionType.SELL,
                category: investment.category.name,
                negotiationDate: new Date(),
                qnt: Number(qnt) * 2,
                price: Number(price) - 5
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.message).toBe("Quantidade de cotas supera a quantidade cotas do investimento 😅");
        });
     
        it("should return status code 200 with success Transaction type SELL total qnt" , async() => {
            const [{id, investment, brokerId, price, qnt}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                brokerId,
                qnt,
                investment: investment.name,
                type: ETransactionType.SELL,
                category: investment.category.name,
                negotiationDate: new Date(),
                price: Number(price) - 5
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Atualização realizada com sucesso!!!");
        });

        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investment e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investment is required");
        });
    });

    describe("Grouping", ()=>{
        it("should return status code 200 with success", async() => {
            const [{investmentId}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/grouping`)
            .send({
                investmentId,
                quantity: 2,
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Agrupamento de Transações realizada com sucesso!!! 😆");
        });
        
        it("should return status code 404 with success", async() => {
            const [{investmentId}] = await GeneratorMock.transaction(1);

            const res = await request(getApp)
            .put(`${prefix}/grouping`)
            .send({
                investmentId: Number(investmentId) + 20,
                quantity: 2,
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body.message).toBe("InvestmentId não encontrado");
        });
    });
});
