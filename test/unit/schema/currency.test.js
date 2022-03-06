import { Chance } from "chance";
import { createCurrencySchema } from "../../../src/validations/currency";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Currency Schemas", () => {

    describe("sucess", ()=>{
        
        it("createCurrencySchema", ()=>{
            const params = {
                body:{
                    code: chance.name()
                }
            };
            const res = validateSchema(createCurrencySchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
        });

    });
    
    describe("error", ()=>{
        
        it("createCurrencySchema - required", ()=>{
            const params = {
                body:{}
            };

            expect(() => validateSchema(createCurrencySchema, params)).toThrowError("\"body.code is required\"");
        });

    });
});