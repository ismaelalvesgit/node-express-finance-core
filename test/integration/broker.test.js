import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";
import transactionType from "../../src/enum/transactionType";

const chance = new  Chance();
describe("Broker Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("transaction").del(),
            knex("investment").del(),
            knex("broker").del(),
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const broker = await knex("broker").insert({
                name: chance.name()
            });

            const res = await request(app)
            .get(`/broker/${broker[0]}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("find", async() => {
            await knex("broker").insert({
                name: chance.name(),
            });

            const res = await request(app)
            .get("/broker")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/broker")
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("broker").insert({
                name: chance.name()
            });
            const res = await request(app)
            .put(`/broker/${id}`)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ id ] = await knex("broker").insert({
                name: chance.name()
            });
            await request(app)
            .del(`/broker/${id}`)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/broker/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/broker")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/broker/${chance.integer()}`)
            .expect(StatusCodes.BAD_REQUEST);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/broker/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });

        it("not delete is has transactions", async() => {
            const [ id ] = await knex("broker").insert({
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
                brokerId: id,
                investmentId: investmentId,
                type: chance.pickone(Object.keys(transactionType)),
                negotiationDate: chance.date(),
                dueDate:chance.date(),
                qnt: 1,
                price: 1000,
                total: 1 * 1000,
            });
            await request(app)
            .del(`/broker/${id}`)
            .expect(StatusCodes.BAD_REQUEST);
        });
    });
    
});