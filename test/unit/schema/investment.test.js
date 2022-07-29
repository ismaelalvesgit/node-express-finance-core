import { Chance } from "chance";
import { findAllInvestmentSchema, batchInvestmentSchema } from "../../../src/validations/investment";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Investment Schemas", () => {

    describe("sucess", ()=>{

        it("findAllInvestmentSchema", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };
            const res = validateSchema(findAllInvestmentSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });

        it("batchInvestmentSchema", ()=>{
            const params = {
                body: [{
                    id: chance.integer({max: 10, min: 1}),
                }]
            };
            const res = validateSchema(batchInvestmentSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
            expect(res.body.length).toBe(1);
        });
    });

    describe("error", ()=>{

        it("findAllInvestmentSchema - Only object type", ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllInvestmentSchema, params)).toThrowError("Only object type");
        });

        it("findAllInvestmentSchema - Must have one attribute", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({
                        name: chance.name(),
                        price: chance.integer(),
                    }),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllInvestmentSchema, params)).toThrowError("Must have one attribute");
        });

        it("batchInvestmentSchema - Must have one attribute", ()=>{
            const params = {
                body: []
            };

            expect(() => validateSchema(batchInvestmentSchema, params)).toThrowError("body must contain at least 1 items");
        });

    });

});