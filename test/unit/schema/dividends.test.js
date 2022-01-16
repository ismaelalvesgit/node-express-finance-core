import { Chance } from 'chance';
import dividendsType from '../../../src/enum/dividendsType';
import { createDividendsSchema, findAllDividendsSchema } from '../../../src/validations/dividends';
import { validateSchema } from '../../utils';

const chance = new Chance();
describe("Dividends Schemas", () => {

    describe('sucess', ()=>{

        it('findAllDividendsSchema', ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            const res = validateSchema(findAllDividendsSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('query')
        })
        
        it('createDividendsSchema', ()=>{
            const params = {
                body:{
                    investmentId: 1,
                    type: chance.pickone(Object.keys(dividendsType)),
                    dueDate: chance.date(),
                    qnt: 2,
                    price: 2000
                }
            }
            const res = validateSchema(createDividendsSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })

    })

    describe('error', ()=>{

        it('findAllDividendsSchema - Only object type', ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            try {
                validateSchema(findAllDividendsSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Only object type')
            }
        })

        it('findAllDividendsSchema - Must have one attribute', ()=>{
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
                validateSchema(findAllDividendsSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Must have one attribute')
            }
        })
        
        it('createDividendsSchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(createDividendsSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.investmentId" is required')
            }
        })

    })

})