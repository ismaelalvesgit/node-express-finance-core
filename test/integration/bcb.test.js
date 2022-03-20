import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../src/app";
import * as bcbService from "../../src/services/bcb.service";
import * as boundService from "../../src/services/bound.service";

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

        it("ibovespa", async() => {
            const res = await request(app)
            .get("/bcb/ibovespa")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("price");
            expect(res.body[0]).toHaveProperty("date");
        });
        
        it("ifix", async() => {
            const res = await request(app)
            .get("/bcb/ifix")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("price");
            expect(res.body[0]).toHaveProperty("date");
        });
        
        it("ipca", async() => {
            const res = await request(app)
            .get("/bcb/ipca")
            .expect(StatusCodes.OK);
            expect(res.body.monthly[0]).toHaveProperty("value");
            expect(res.body.yearly[0]).toHaveProperty("value");
        });

        it("cdi", async() => {
            const res = await request(app)
            .get("/bcb/cdi")
            .expect(StatusCodes.OK);
            expect(res.body.monthly[0]).toHaveProperty("value");
            expect(res.body.yearly[0]).toHaveProperty("value");
        });

        it("bdrx", async() => {
            const res = await request(app)
            .get("/bcb/bdrx")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("price");
            expect(res.body[0]).toHaveProperty("date");
        });

        it("sp500", async() => {
            const res = await request(app)
            .get("/bcb/sp500")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("price");
            expect(res.body[0]).toHaveProperty("date");
        });

        it("boundList", async() => {
            boundService.findAll = jest.fn().mockResolvedValue([{
                code: "tesouro-ipca-com-juros-semestrais-2026"
            }]);

            const res = await request(app)
            .get("/bcb/boundList")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("code");
        });

        it("bound", async() => {
            const res = await request(app)
            .get("/bcb/bound/tesouro-ipca-com-juros-semestrais-2026")
            .expect(StatusCodes.OK);
            expect(res.body[0]).toHaveProperty("sellprice");
            expect(res.body[0]).toHaveProperty("date");
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

        it("ibovespa", async() => {
            bcbService.ibovespa = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/ibovespa")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("ifix", async() => {
            bcbService.ifix = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/ifix")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("ipca", async() => {
            bcbService.ipca = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/ipca")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("cdi", async() => {
            bcbService.cdi = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/cdi")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("bdrx", async() => {
            bcbService.bdrx = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/bdrx")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("sp500", async() => {
            bcbService.sp500 = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/sp500")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("boundList", async() => {
            boundService.findAll = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/boundList")
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);
        });

        it("bound", async() => {
            bcbService.bound = jest.fn().mockRejectedValue("fail");
            await request(app)
            .get("/bcb/bound/sp500")
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