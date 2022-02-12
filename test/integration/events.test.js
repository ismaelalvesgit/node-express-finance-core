import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";

const chance = new  Chance();
describe("Events Router", () => {
    
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
            const [ id ] = await knex("events").insert({
                investmentId: investmentId,
                dateReference: new Date(),
                dateDelivery: new Date(),
                assetMainId: 27780692,
                link: chance.url(),
                description: chance.name(),
            });

            const res = await request(app)
            .get(`/events/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("dateReference");
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
            await knex("events").insert({
                investmentId: investmentId,
                dateReference: new Date(),
                dateDelivery: new Date(),
                assetMainId: 27780692,
                link: chance.url(),
                description: chance.name(),
            });

            const res = await request(app)
            .get(`/events?sortBy=id&orderBy=asc&limit=1&search={"investmentId":"${investmentId}"}`)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("dateReference");
            expect(res.body[0]).toHaveProperty("id");
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/events/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
    });
    
});