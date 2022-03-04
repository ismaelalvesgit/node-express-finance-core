import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import transactionType from "../../src/enum/transactionType";
import * as brapiService from "../../src/services/brapi.service";
import * as categoryModel from "../../src/model/category.model";
import categoryType from "../../src/enum/categoryType";

/* eslint-disable no-import-assign */
const chance = new  Chance();
describe("Investment Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("investment").del()
        ]);
        jest.clearAllMocks();
    });

    describe("sucess", ()=>{
        it("search", async() => {
            const res = await request(app)
            .get("/investment/available")
            .query({
                search: "ETH",
                category: categoryType.CRIPTOMOEDA
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });

        it("findOne", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ id ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });

            const res = await request(app)
            .get(`/investment/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("find", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const name = chance.name();
            await knex("investment").insert({
                name,
                categoryId
            });

            const res = await request(app)
            .get(`/investment?sortBy=id&orderBy=asc&limit=1&search={"name":"${name}"}`)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            brapiService.findQoute = jest.fn().mockResolvedValue({
                symbol: "VINO11",
            });

            const [ categoryId ] = await knex("category").insert({
                name: categoryType.ACAO
            });
            
            const res = await request(app)
            .post("/investment")
            .send({
                name: "VINO11",
                categoryId,
                sector: "TESTE"
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ id ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });

            const res = await request(app)
            .put(`/investment/${id}`)
            .send({
                sector: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ id ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            await request(app)
            .del(`/investment/${id}`)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("search", async() => {
            await request(app)
            .get("/investment/available")
            .query({
                search: "1",
                category: categoryType.CRIPTOMOEDA
            })
            .expect(StatusCodes.NOT_FOUND);
        });

        it("findOne", async() => {
            await request(app)
            .get(`/investment/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/investment")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });

        it("not create not found investment", async() => {
            brapiService.findQoute = jest.fn().mockResolvedValue(null);
            categoryModel.findAll = jest.fn().mockResolvedValue([]);

            const res = await request(app)
            .post("/investment")
            .send({
                name: chance.name(),
                categoryId: chance.string({numeric: true}),
                sector: "TESTE"
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });

        it("not create not found category", async() => {
            brapiService.findQoute = jest.fn().mockResolvedValue({
                symbol: "VINO11"
            });
            categoryModel.findAll = jest.fn().mockResolvedValue([]);

            const res = await request(app)
            .post("/investment")
            .send({
                name: "VINO11",
                categoryId: chance.string({numeric: true}),
                sector: "TESTE"
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/investment/${chance.string({numeric: true})}`)
            .expect(StatusCodes.BAD_REQUEST);
        });

        it("not update category not found", async() => {
            categoryModel.findAll = jest.fn().mockResolvedValue([]);
            await request(app)
            .put(`/investment/${chance.string({numeric: true})}`)
            .send({
                categoryId: chance.string({numeric: true})
            })
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/investment/${chance.string({numeric: true})}`)
            .expect(StatusCodes.NOT_FOUND);
        });

        it("not delete is has transactions", async() => {
            const [ brokerId ] = await knex("broker").insert({
                name: chance.name()
            });
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ id ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            await knex("transaction").insert({
                brokerId,
                investmentId: id,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });
            await request(app)
            .del(`/investment/${id}`)
            .expect(StatusCodes.BAD_REQUEST);
        });
    });
    
});
/* eslint-enable no-import-assign */