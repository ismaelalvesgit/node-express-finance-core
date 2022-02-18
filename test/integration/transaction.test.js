import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import transactionType from "../../src/enum/transactionType";
import categoryType from "../../src/enum/categoryType";
import * as transactionModel from "../../src/model/transaction.model";
import * as investmentService from "../../src/services/investment.service";

const chance = new  Chance();
describe("Transaction Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("investment").del()
        ]);
        jest.clearAllMocks();
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const [ brokerId ] = await knex("broker").insert({
                name: chance.name()
            });
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("transaction").insert({
                brokerId,
                investmentId,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                dueDate:chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });

            const res = await request(app)
            .get(`/transaction/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("type");
            expect(res.body).toHaveProperty("id");
        });
        
        it("find", async() => {
            const [ brokerId ] = await knex("broker").insert({
                name: chance.name()
            });
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            await knex("transaction").insert({
                brokerId,
                investmentId,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                dueDate:chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });
            const res = await request(app)
            .get(`/transaction?sortBy=id&orderBy=asc&limit=1&search={"investmentId":"${investmentId}"}`)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("type");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/transaction")
            .send({
                broker: "RICO INVESTIMENTOS",
                investment: "VINO11",
                category: categoryType.FIIS,
                type: transactionType.BUY,
                negotiationDate: chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ brokerId ] = await knex("broker").insert({
                name: chance.name()
            });
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("transaction").insert({
                brokerId,
                investmentId,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                dueDate:chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });

            const res = await request(app)
            .put(`/transaction/${id}`)
            .send({
                broker: "RICO INVESTIMENTOS",
                investment: "VISC11",
                category: categoryType.FIIS,
                type: transactionType.BUY,
                negotiationDate: chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            // eslint-disable-next-line no-import-assign
            transactionModel.findOne = jest.fn().mockResolvedValue({
                investment: {
                    id: chance.string({numeric: true})
                }
            });
            // eslint-disable-next-line no-import-assign
            transactionModel.del = jest.fn().mockReturnThis();
            // eslint-disable-next-line no-import-assign
            investmentService.updateBalance = jest.fn().mockResolvedValue(1);

            await request(app)
            .del(`/transaction/${chance.string({numeric: true})}`)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/transaction/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/transaction")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });

        it("not is create investment not exist", async() => {
            const res = await request(app)
            .post("/transaction")
            .send({
                broker: "RICO INVESTIMENTOS",
                investment: chance.name(),
                category: categoryType.FIIS,
                type: transactionType.BUY,
                negotiationDate: chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/transaction/${chance.integer()}`)
            .expect(StatusCodes.BAD_REQUEST);
        });

        it("not is not update investment not exist", async() => {
            const [ brokerId ] = await knex("broker").insert({
                name: chance.name()
            });
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("transaction").insert({
                brokerId,
                investmentId,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                dueDate:chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });

            const res = await request(app)
            .put(`/transaction/${id}`)
            .send({
                broker: "RICO INVESTIMENTOS",
                investment: chance.name(),
                category: categoryType.FIIS,
                type: transactionType.BUY,
                negotiationDate: chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            // eslint-disable-next-line no-import-assign
            transactionModel.findOne = jest.fn().mockResolvedValue(null);

            await request(app)
            .del(`/transaction/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });

    });
    
});