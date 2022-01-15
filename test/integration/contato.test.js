import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import { Chance } from "chance";
import knex from "../../src/db";

const chance = new  Chance();
describe("Contato Router", () => {
    
    beforeEach(async()=>{
        await Promise.all([
            knex("contato").del()
        ]);
    });

    describe("sucess", ()=>{
        it("findOne", async() => {
            const contato = await knex("contato").insert({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 11})
            });

            const res = await request(app)
            .get(`/contato/${contato[0]}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("nome");
            expect(res.body).toHaveProperty("telefone");
        });
        
        it("find", async() => {
            await knex("contato").insert({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 11}),
            });

            const res = await request(app)
            .get("/contato")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("nome");
            expect(res.body[0]).toHaveProperty("telefone");
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/contato")
            .send({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 11})
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            const [ id ] = await knex("contato").insert({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 11}),
            });
            const res = await request(app)
            .put(`/contato/${id}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("delete", async() => {
            const [ id ] = await knex("contato").insert({
                nome: chance.name(),
                telefone: chance.string({numeric: true, length: 11}),
            });
            await request(app)
            .del(`/contato/${id}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.NO_CONTENT);
        });
    });
    
    describe("erro", ()=>{
        it("findOne", async() => {
            await request(app)
            .get(`/contato/${chance.integer()}`)
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("create", async() => {
            const res = await request(app)
            .post("/contato")
            .send({
                nome: chance.name()
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body).toBeDefined();
        });
       
        it("update", async() => {
            await request(app)
            .put(`/contato/${chance.integer()}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND);
        });
        
        it("delete", async() => {
            await request(app)
            .del(`/contato/${chance.integer()}`)
            .send({
                nome: chance.name(),
            })
            .expect(StatusCodes.NOT_FOUND);
        });
    });
    
});