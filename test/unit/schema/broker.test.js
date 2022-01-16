import { Chance } from 'chance';
import { ValidadeSchema } from '../../../src/utils/erro';
import { createBrokerSchema, findAllBrokerSchema, updateBrokerSchema } from '../../../src/validations/broker';
import { validateSchema } from '../../utils';

const chance = new Chance();
describe("Broker Schemas", () => {

    describe('sucess', ()=>{

        it('findAllBrokerSchema', ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            const res = validateSchema(findAllBrokerSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('query')
        })
        
        it('createBrokerSchema', ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            }
            const res = validateSchema(createBrokerSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })

        it('updateBrokerSchema', ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            }
            const res = validateSchema(updateBrokerSchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })
    })
    
    describe('error', ()=>{

        it('findAllBrokerSchema - Only object type', ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            try {
                validateSchema(findAllBrokerSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Only object type')
            }
        })

        it('findAllBrokerSchema - Must have one attribute', ()=>{
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
                validateSchema(findAllBrokerSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Must have one attribute')
            }
        })
        
        it('createBrokerSchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(createBrokerSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.name" is required')
            }
        })

        it('updateBrokerSchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(updateBrokerSchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.name" is required')
            }
        })
    })
})