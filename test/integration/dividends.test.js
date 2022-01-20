import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import dividendsType from "../../src/enum/dividendsType";

const chance = new  Chance();
describe("Dividends Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("investment").del()
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("dividends").insert({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000,
                total: 2 * 2000
            });

            const res = await request(app)
            .get(`/dividends/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("type");
            expect(res.body).toHaveProperty("id");
        });
        
        it("find", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            await knex("dividends").insert({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000,
                total: 2 * 2000
            });

            const res = await request(app)
            .get(`/dividends?sortBy=id&orderBy=asc&limit=1&search={"investmentId":"${investmentId}"}`)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("type");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const res = await request(app)
            .post("/dividends")
            .send({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("dividends").insert({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000,
                total: 2 * 2000
            });

            const res = await request(app)
            .put(`/dividends/${id}`)
            .send({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ categoryId ] = await knex("category").insert({
                name: chance.name()
            });
            const [ investmentId ] = await knex("investment").insert({
                name: chance.name(),
                categoryId
            });
            const [ id ] = await knex("dividends").insert({
                investmentId: investmentId,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000,
                total: 2 * 2000
            });

            await request(app)
            .del(`/dividends/${id}`)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/dividends/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/dividends")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });

        it("not is create investment not exist", async() => {
            const res = await request(app)
            .post("/dividends")
            .send({
                investmentId: 1,
                type: chance.pickone(Object.keys(dividendsType)),
                dueDate: chance.date(),
                qnt: 2,
                price: 2000
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
       
       
        it("update", async() => {
            await request(app)
            .put(`/dividends/${chance.integer()}`)
            .expect(StatusCodes.BAD_REQUEST);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/dividends/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });

    });
    
});