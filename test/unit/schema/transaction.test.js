import { Chance } from "chance";
import categoryType from "../../../src/enum/categoryType";
import transactionType from "../../../src/enum/TransactionType";
import { createTransactionSchema, findAllTransactionSchema } from "../../../src/validations/Transaction";
import { validateSchema } from "../../utils";

const chance = new Chance();
describe("Transaction Schemas", () => {

    describe("sucess", ()=>{

        it("findAllTransactionSchema", ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };
            const res = validateSchema(findAllTransactionSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("query");
        });
        
        it("createTransactionSchema", ()=>{
            const params = {
                body:{
                    broker: "RICO INVESTIMENTOS",
                    investment: "VINO11",
                    category: categoryType.FIIS,
                    type: transactionType.BUY,
                    negotiationDate: chance.date(),
                    qnt: 1,
                    price: 1000,
                    total: 1 * 1000,
                }
            };
            const res = validateSchema(createTransactionSchema, params);
            expect(res).toBeDefined();
            expect(res).toHaveProperty("body");
        });

    });

    describe("error", ()=>{

        it("findAllTransactionSchema - Only object type", ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(["asc", "desc"]),
                    limit: 10
                }
            };

            expect(() => validateSchema(findAllTransactionSchema, params)).toThrowError("Only object type");
        });

        it("findAllTransactionSchema - Must have one attribute", ()=>{
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

            expect(() => validateSchema(findAllTransactionSchema, params)).toThrowError("Must have one attribute");
        });
        
        it("createTransactionSchema - required", ()=>{
            const params = {
                body:{}
            };

            expect(() => validateSchema(createTransactionSchema, params)).toThrowError("\"body.investment is required\"");
        });

    });

});