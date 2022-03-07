import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";

const chance = new  Chance();
describe("Currency Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("currencyFavorite").del()
        ]);
    });

    describe("sucess", ()=>{

        it("last", async() => {
            await knex("currencyFavorite").insert({
                code: "BTC-BRL"
            });

            const res = await request(app)
            .get("/currency/last")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("code");
            expect(res.body[0]).toHaveProperty("id");
        });

        it("available", async() => {
            const res = await request(app)
            .get("/currency/available")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("code");
            expect(res.body[0]).toHaveProperty("id");
        });

        it("code", async() => {
            const res = await request(app)
            .get("/currency/code")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("code");
            expect(res.body[0]).toHaveProperty("id");
        });

        it("find", async() => {
            await knex("currencyFavorite").insert({
                code: chance.name()
            });
            const res = await request(app)
            .get("/currency")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("code");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/currency")
            .send({
                code: "BTC-BRL"
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ id ] = await knex("currencyFavorite").insert({
                code: chance.name()
            });
            await request(app)
            .del(`/currency/${id}`)
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("create", async() => {
            const res = await request(app)
            .post("/currency")
            .send({
                code: chance.name()
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/currency/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
    });
    
});