import { Chance } from "chance";
import { createBrokerSchema, findAllBrokerSchema, updateBrokerSchema } from "../../../src/validations/broker";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Broker Schemas", () => {

    describe("sucess", ()=>{

        it("findAllBrokerSchema", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };
            const res = validateSchema(findAllBrokerSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });
        
        it("createBrokerSchema", ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            };
            const res = validateSchema(createBrokerSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
        });

        it("updateBrokerSchema", ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            };
            const res = validateSchema(updateBrokerSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
        });
    });
    
    describe("error", ()=>{

        it("findAllBrokerSchema - Only object type", ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllBrokerSchema, params)).toThrowError("Only object type");
        });

        it("findAllBrokerSchema - Must have one attribute", ()=>{
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

            expect(() => validateSchema(findAllBrokerSchema, params)).toThrowError("Must have one attribute");
        });
        
        it("createBrokerSchema - required", ()=>{
            const params = {
                body:{}
            };

            expect(() => validateSchema(createBrokerSchema, params)).toThrowError("\"body.name is required\"");
        });

        it("updateBrokerSchema - required", ()=>{
            const params = {
                body:{}
            };

            expect(() => validateSchema(updateBrokerSchema, params)).toThrowError("\"body.name is required\"");
        });
    });
});