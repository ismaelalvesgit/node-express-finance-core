import { Chance } from "chance";
import { findAllNewsSchema } from "../../../src/validations/news";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("News Schemas", () => {

    describe("sucess", ()=>{

        it("findAllNewsSchema", ()=>{
            const params = {
                query:{
                    keywords: chance.name(),
                    languages: "en",
                    countries: "br",
                    source: "InfoMoney"
                }
            };
            const res = validateSchema(findAllNewsSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });
    });
});