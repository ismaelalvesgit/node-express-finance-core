import { container } from "@di/container";
import knex from "@infrastructure/knex/knex";
import { App } from "../../../app";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { GeneratorMock } from "@test/generator.mock";
import { EDividendsType } from "@domain/dividends/types/IDividends";
import DateHelper from "@helpers/Date";

const { getApp } = container.resolve(App);
const prefix = "/v1/dividends";

describe("Dividends Router", () => {

    describe("Find By Id", ()=>{

        it("should return status code 200 with success", async() => {
            const [{id}] = await GeneratorMock.dividends(1);

            const res = await request(getApp)
            .get(`${prefix}/${id}`)
            .expect(StatusCodes.OK);
            expect(res.body).toHaveProperty("investmentId");
            expect(res.body).toHaveProperty("brokerId");
        });
        
        it("should return status code 200 with success and empty", async() => {
            const { id } = await knex("dividends").select("id").orderBy("id", "desc").limit(1).first();

            const res = await request(getApp)
            .get(`${prefix}/${Number(id) + 10}`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Find All", ()=>{
        it("should return status code 200 with success", async() => {
            await GeneratorMock.dividends(1);
            const res = await request(getApp)
            .get(`${prefix}`)
            .expect(StatusCodes.OK);
            expect(res.body.items[0]).toHaveProperty("investmentId");
            expect(res.body.items[0]).toHaveProperty("id");
        });
        
        it("should return status code 200 with success and empty", async() => {
            await GeneratorMock.clearTable(["dividends"]);

            const res = await request(getApp)
            .get(`${prefix}/`)
            .expect(StatusCodes.OK);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Delete", ()=>{
        it("should return status code 204 with success", async() => {
            const [{id}] = await GeneratorMock.dividends(1);

            const res = await request(getApp)
            .delete(`${prefix}/${id}`)
            .expect(StatusCodes.NO_CONTENT);
            expect(res.body).not.toHaveProperty("investmentId");
        });
    });
    
    describe("Create", ()=>{
        it("should return status code 201 with success", async() => {
            const [[investment], [broker]] = await Promise.all([
                GeneratorMock.investment(1),
                GeneratorMock.broker(1)
            ]);
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                investmentId: investment.id,
                brokerId: broker.id,
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.CREATED);
            expect(res.body).toBe("Dividendo cadastrado com sucesso!!! 😆");
        });
        
        it("should return status code 404 NotFound broker", async() => {
            const [[investment], [broker]] = await Promise.all([
                GeneratorMock.investment(1),
                GeneratorMock.broker(1)
            ]);
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                investmentId: Number(investment.id),
                brokerId: Number(broker.id) + 20,
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body.message).toContain("Broker não encontrado");
        });
  
        it("should return status code 404 NotFound investment", async() => {
            const [[investment], [broker]] = await Promise.all([
                GeneratorMock.investment(1),
                GeneratorMock.broker(1)
            ]);
            const res = await request(getApp)
            .post(`${prefix}`)
            .send({
                investmentId: Number(investment.id) + 20,
                brokerId: Number(broker.id),
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body.message).toContain("Investment não encontrado");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investmentId e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .post(`${prefix}`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investmentId is required");
        });
    });
    
    describe("Update", ()=>{
        it("should return status code 200 with success", async() => {
            const [{id, investmentId, brokerId}] = await GeneratorMock.dividends(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                investmentId,
                brokerId,
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Dividendo atualizado com sucesso!!!");
        });
 
        it("should return status code 400 NotFound investment", async() => {
            const [{id, investmentId, brokerId}] = await GeneratorMock.dividends(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                investmentId: Number(investmentId) + 20,
                brokerId,
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body.message).toBe("Investment não encontrado");
        });

        it("should return status code 400 NotFound broker", async() => {
            const [{id, investmentId, brokerId}] = await GeneratorMock.dividends(1);

            const res = await request(getApp)
            .put(`${prefix}/${id}`)
            .send({
                investmentId,
                brokerId: Number(brokerId) + 20,
                qnt: 10,
                price: 0.50,
                type: EDividendsType.DIVIDEND,
                dueDate: new Date(),
                dateBasis: new Date()
            })
            .expect(StatusCodes.NOT_FOUND);
            expect(res.body.message).toBe("Broker não encontrado");
        });
        
        it("should return status code 400 data not valid", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investmentId e obrigátorio");
        });
        
        it("should return status code 400 data not valid lang en-US", async() => {
           const res = await request(getApp)
            .put(`${prefix}/12`)
            .set("accept-language", "en-US")
            .expect(StatusCodes.BAD_REQUEST);
            expect(res.body.details[0].message).toBe("investmentId is required");
        });
    });

    describe("AutoCreateUpdate", ()=>{
        it("should return status code 200 with success", async() => {
            const [{investmentId}] = await GeneratorMock.transaction(1);
            const dueDate = DateHelper.formatDate(new Date());
            const dateBasis = DateHelper.formatDate(DateHelper.addDays(new Date(), 1));

            const res = await request(getApp)
            .post(`${prefix}/autoCreate`)
            .send([
                {
                    investmentId,
                    dueDate,
                    dateBasis,
                    type: EDividendsType.DIVIDEND,
                    price: 0.50
                }
            ])
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Dividendo cadastrado com sucesso!!! 😆");
        });
        
        it("should return status code 200 with success update qnt and total", async() => {
            const [{investmentId, qnt}] = await GeneratorMock.transaction(1);
            const dueDate = DateHelper.formatDate(new Date());
            const dateBasis = DateHelper.formatDate(DateHelper.addDays(new Date(), 1));

            await request(getApp)
            .post(`${prefix}/autoCreate`)
            .send([
                {
                    investmentId,
                    dueDate,
                    dateBasis,
                    type: EDividendsType.DIVIDEND,
                    price: 0.50
                }
            ])
            .expect(StatusCodes.OK);
            await knex("transaction").update({qnt: Number(qnt) + 10}).where({investmentId});
            
            const res = await request(getApp)
            .post(`${prefix}/autoCreate`)
            .send([
                {
                    investmentId,
                    dueDate,
                    dateBasis,
                    type: EDividendsType.DIVIDEND,
                    price: 0.50
                }
            ])
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Dividendo cadastrado com sucesso!!! 😆");
        });
    });
    
    describe("AutoPaid", ()=>{
        it("should return status code 200 with success", async() => {
            const [{investmentId}] = await GeneratorMock.transaction(1);
            const dueDate = DateHelper.formatDate(new Date());
            const dateBasis = DateHelper.formatDate(DateHelper.addDays(new Date(), 1));
            
            await request(getApp)
            .post(`${prefix}/autoCreate`)
            .send([
                {
                    investmentId,
                    dueDate,
                    dateBasis,
                    type: EDividendsType.DIVIDEND,
                    price: 0.50
                }
            ]).expect(StatusCodes.OK);
            
            const res = await request(getApp)
            .post(`${prefix}/autoPaid`)
            .send({
                dueDate: DateHelper.addDays(new Date(), 1)
            })
            .expect(StatusCodes.OK);
            expect(res.body).toBe("Dividendo atualizado com sucesso!!!");
        });
    });
});
