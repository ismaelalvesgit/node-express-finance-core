import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import * as bcbService from "../../src/services/bcb.service";

/* eslint-disable no-import-assign */
describe("Bcb Router", () => {
    
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    describe("sucess", ()=>{
        it("selic", async() => {
            const res = await request(app)
            .get("/bcb/selic")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("data");
            expect(res.body[0]).toHaveProperty("value");
        });

        it("inflaction", async() => {
            const res = await request(app)
            .get("/bcb/inflaction")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("data");
            expect(res.body[0]).toHaveProperty("value");
        });

        it("inflactionIndicator", async() => {
            const res = await request(app)
            .get("/bcb/inflactionIndicator")
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("title");
            expect(res.body).toHaveProperty("yearGoal");
        });

        it("news", async() => {
            const res = await request(app)
            .get("/bcb/news")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("title");
            expect(res.body[0]).toHaveProperty("body");
        });
    });
    
    describe("erro", ()=>{
        it("selic", async() => {
            bcbService.selic = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/selic")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("inflaction", async() => {
            bcbService.inflaction = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/inflaction")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("inflactionIndicator", async() => {
            bcbService.inflactionIndicator = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/inflactionIndicator")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("news", async() => {
            bcbService.news = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/news")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }); 

});
/* eslint-enable no-import-assign */