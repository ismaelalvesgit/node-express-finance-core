import { Chance } from "chance";
import { createInvestmentSchema, findAllInvestmentSchema } from "../../../src/validations/investment";
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
        
        it("createInvestmentSchema", ()=>{
            const params = {
                body:{
                    categoryId: 1,
                    name: "VINO11",
                    longName: "FIIS",
                    sector: "FIIS",
                }
            };
            const res = validateSchema(createInvestmentSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
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
        
        it("createInvestmentSchema - required", ()=>{
            const params = {
                body:{}
            };

            expect(() => validateSchema(createInvestmentSchema, params)).toThrowError("\"body.categoryId is required\"");
        });

    });

});