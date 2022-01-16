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
            await knex("category").insert({
                name: chance.name(),
            });

            const res = await request(app)
            .get("/category")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("name");
            expect(res.body[0]).toHaveProperty("id");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/category")
            .send({
                name: chance.name()
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("category").insert({
                name: chance.name()
            });
            const res = await request(app)
            .put(`/category/${id}`)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ id ] = await knex("category").insert({
                name: chance.name()
            });
            await request(app)
            .del(`/category/${id}`)
            .send({
                name: chance.name(),
            })
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/category/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/category")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/category/${chance.integer()}`)
            .expect(StatusCodes.BAD_REQUEST);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/category/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
    });

});