import { Chance } from 'chance';
import transactionType from '../../../src/enum/TransactionType';
import { createTransactionSchema, findAllTransactionSchema } from '../../../src/validations/Transaction';
import { validateSchema } from '../../utils';

const chance = new Chance();
describe("Transaction Schemas", () => {

    describe('sucess', ()=>{

        it('findAllTransactionSchema', ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            const res = validateSchema(findAllTransactionSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('query')
        })
        
        it('createTransactionSchema', ()=>{
            const params = {
                body:{
                    broker: "RICO INVESTIMENTOS",
                    investment: "VINO11",
                    category: "FIIS",
                    type: transactionType.BUY,
                    negotiationDate: chance.date(),
                    qnt: 1,
                    price: 1000,
                    total: 1 * 1000,
                }
            }
            const res = validateSchema(createTransactionSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })

    })

    describe('error', ()=>{

        it('findAllTransactionSchema - Only object type', ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            try {
                validateSchema(findAllTransactionSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Only object type')
            }
        })

        it('findAllTransactionSchema - Must have one attribute', ()=>{
            const params = {
                query:{
                    search: JSON.stringify({
                        name: chance.name(),
                        price: chance.integer(),
                    }),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            try {
                validateSchema(findAllTransactionSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Must have one attribute')
            }
        })
        
        it('createTransactionSchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(createTransactionSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.investment" is required')
            }
        })

    })

})