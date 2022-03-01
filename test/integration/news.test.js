import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import * as newsService from "../../src/services/news.service";

/* eslint-disable no-import-assign */
describe("News Router", () => {
    
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    describe("sucess", ()=>{
        it("find", async() => {
            newsService.findNews = jest.fn().mockResolvedValue({
                pagination: {},
                data: []
            });
            const res = await request(app)
            .get("/news")
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("data");
            expect(res.body).toHaveProperty("pagination");
        });
    });
    
    describe("erro", ()=>{
        it("find", async() => {
            newsService.findNews = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/news")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    }); 

});
/* eslint-enable no-import-assign */