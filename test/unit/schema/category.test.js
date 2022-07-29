import { Chance } from "chance";
import { findAllCategorySchema } from "../../../src/validations/category";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Category Schemas", () => {

    describe("sucess", ()=>{

        it("findAllCategorySchema", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };
            
            const res = validateSchema(findAllCategorySchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });
    });

    describe("error", ()=>{

        it("findAllCategorySchema - Only object type", ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllCategorySchema, params)).toThrowError("Only object type");
        });

        it("findAllCategorySchema - Must have one attribute", ()=>{
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

            expect(() => validateSchema(findAllCategorySchema, params)).toThrowError("Must have one attribute");
        });
    });

});