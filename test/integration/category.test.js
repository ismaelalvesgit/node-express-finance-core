import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";

const chance = new  Chance();
describe("Category Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("category").del(),
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const category = await knex("category").insert({
                name: chance.name()
            });

            const res = await request(app)
            .get(`/category/${category[0]}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("name");
            expect(res.body).toHaveProperty("id");
        });
        
        it("find", async() => {
            const name = chance.name();
            await knex("category").insert({
                name,
            });

            const res = await request(app)
            .get(`/category?sortBy=id&orderBy=asc&limit=1&search={"name":"${name}"}`)
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("id");
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/category/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
    });

});