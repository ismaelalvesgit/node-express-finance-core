import { container } from "@di/container";
import { App } from "../../../app";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { Config } from "@config/config";
import nock from "nock";
import { EBcbIndexType } from "@domain/bcb/types/IBcb";
import { EIndexerPeriod, EIndexPeriod } from "@domain/investment/types/IInvest";

const url = new Config().get().backend.bcb;
const { getApp } = container.resolve(App);
const requestMock = nock(url);
const prefix = "/v1/bcb";

describe("Bcb Router", () => {
    
    describe("Index", ()=>{
        it.each([
            ["SELIC", "22/04/2025", "22/04/2025"],
            ["INFLACTION", "22/04/2025", "22/04/2025"],
        ])("should return status code 200 with success %s", async(type, dateStart, dateEnd) => {
            requestMock.get("/api/servico/sitebcb/bcdatasgs")
            .query({
                serie: EBcbIndexType[type],
                dataInicial: dateStart,
                dataFinal: dateEnd,
            })
            .reply(200, {conteudo: []});

            const res = await request(getApp)
            .get(`${prefix}/index`)
            .query({
                type,
                dateStart,
                dateEnd
            })
            .expect(StatusCodes.OK);
            expect(res.body).toStrictEqual([]);
        });
        
        it("should return status code 400 duplicated data", async() => {
            const res = await request(getApp)
            .get(`${prefix}/index`)
            .query({
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toContain("type deve ser um de 432,13522,SELIC,INFLACTION");
        });

        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .get(`${prefix}/index`)
            .set("accept-language", "en-US")
            .query({
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("type must be one of 432,13522,SELIC,INFLACTION");
        });
    });

    describe("IndexV2", ()=>{
        it.each([
            ["BDRX", "FIVE_DAYS"],
            ["IFIX", "SEVENTY_DAYS"],
            ["IBOV", "ONE_YEAR"],
            ["SP500", "FIVE_YEARS"],
        ])("should return status code 200 with success %s", async(type, period) => {
            const res = await request(getApp)
            .get(`${prefix}/indexV2`)
            .query({
                type,
                period
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
        
        it("should return status code 400 duplicated data", async() => {
            const res = await request(getApp)
            .get(`${prefix}/indexV2`)
            .query({
                period: EIndexPeriod.ONE_YEAR,
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toContain("type deve ser um de BDRX,IFIX,IBOV,SP500");
        });

        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .get(`${prefix}/indexV2`)
            .set("accept-language", "en-US")
            .query({
                period: EIndexPeriod.ONE_YEAR,
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("type must be one of BDRX,IFIX,IBOV,SP500");
        });
    });

    describe("Indexer", ()=>{
        it.each([
            ["IPCA", "ONE_YEAR"],
            ["CDI", "ONE_YEAR"],
        ])("should return status code 200 with success %s", async(type, period) => {
            const res = await request(getApp)
            .get(`${prefix}/indexer`)
            .query({
                type,
                period
            })
            .expect(StatusCodes.OK);
            expect(res.body.monthly).toBeDefined();
            expect(res.body.yearly).toBeDefined();
        });
        
        it("should return status code 400 duplicated data", async() => {
            const res = await request(getApp)
            .get(`${prefix}/indexer`)
            .query({
                period: EIndexerPeriod.ONE_YEAR,
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toContain("type deve ser um de IPCA,CDI");
        });

        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .get(`${prefix}/indexer`)
            .set("accept-language", "en-US")
            .query({
                period: EIndexerPeriod.ONE_YEAR,
                type: "NOT_EXIST"
            })
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("type must be one of IPCA,CDI");
        });
    });

    describe("InflactionIndicator", ()=>{
        it("should return status code 200 with success", async() => {
            requestMock.get("/api/servico/sitebcb/indicadorinflacao").reply(200, {conteudo: [{
                
                    titulo: "INDICADOR_INFLACAO",
                    anoMeta: 2025.0,
                    taxaMeta: 3.0,
                    margemErro: 1.5,
                    taxaInflacao: 5.48,
                    Acumulada: 3.59
                
            }]});

            const res = await request(getApp)
            .get(`${prefix}/inflactionIndicator`)

            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
    });
    
    describe("News", ()=>{
        it("should return status code 200 with success", async() => {
            requestMock.get("/api/servico/sitebcb/manchetes")
            .query({
                listsite: "content/home",
                listname: "Manchetes",
                q: "campanha",
            })
            .reply(200, {conteudo: []});

            const res = await request(getApp)
            .get(`${prefix}/news`)

            .expect(StatusCodes.OK);
            expect(res.body).toBeDefined();
        });
    });
});