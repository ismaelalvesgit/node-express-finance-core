import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { Chance } from "chance";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";

const chance = new Chance();
const { getApp } = container.resolve(App);
const prefix = "/v1/events";

describe("Events Router", () => {

    describe("Find By Id", ()=>{

        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.events(1);

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("investmentId");
            expect(res.body).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("events").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.events(1);
            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("investmentId");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await GeneratorMock.clearTable(["events"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Batch Create", ()=>{
        it("should return status code 201 with success", async() => {
            const [investment] = await GeneratorMock.investment(1);
            const res = await request(getApp)
            .post(`${prefix}/batch`)
            .send([
                {
                    investmentId: investment.id,
                    link: chance.url(),
                    dateReference: new Date(),
                    dateDelivery: new Date(),
                    description: chance.string()
                }
            ])
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Evento criado com sucesso!!!");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .post(`${prefix}/batch`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("\"body\" deve ser uma matriz");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .post(`${prefix}/batch`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("\"body\" must be an array");
        });
    });
});
