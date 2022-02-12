import { Chance } from "chance";
import { findAllEventsSchema } from "../../../src/validations/events";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Events Schemas", () => {

    describe("sucess", ()=>{

        it("findAllEventsSchema", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };
            const res = validateSchema(findAllEventsSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });
    });

    describe("error", ()=>{

        it("findAllEventsSchema - Only object type", ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllEventsSchema, params)).toThrowError("Only object type");
        });

        it("findAllEventsSchema - Must have one attribute", ()=>{
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

            expect(() => validateSchema(findAllEventsSchema, params)).toThrowError("Must have one attribute");
        });
    });
});