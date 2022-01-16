import { Chance } from 'chance';
import { createCategorySchema, findAllCategorySchema, updateCategorySchema } from '../../../src/validations/category';
import { validateSchema } from '../../utils';

const chance = new Chance();
describe("Category Schemas", () => {

    describe('sucess', ()=>{

        it('findAllCategorySchema', ()=>{
            const params = {
                query:{
                    search: JSON.stringify({name: chance.name()}),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            const res = validateSchema(findAllCategorySchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('query')
        })
        
        it('createCategorySchema', ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            }
            const res = validateSchema(createCategorySchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })

        it('updateCategorySchema', ()=>{
            const params = {
                body:{
                    name: chance.name()
                }
            }
            const res = validateSchema(updateCategorySchema, params)
            expect(res).toBeDefined()
            expect(res).toHaveProperty('body')
        })
    })

    describe('error', ()=>{

        it('findAllCategorySchema - Only object type', ()=>{
            const params = {
                query:{
                    search: chance.name(),
                    sortBy: chance.name(),
                    orderBy: chance.pickone(['asc', 'desc']),
                    limit: 10
                }
            }
            try {
                validateSchema(findAllCategorySchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Only object type')
            }
        })

        it('findAllCategorySchema - Must have one attribute', ()=>{
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
                validateSchema(findAllCategorySchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('Must have one attribute')
            }
        })
        
        it('createCategorySchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(createCategorySchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.name" is required')
            }
        })

        it('updateCategorySchema - required', ()=>{
            const params = {
                body:{}
            }
            try {
                validateSchema(updateCategorySchema, params)
            } catch (error) {
                const res = JSON.parse(error.message)
                expect(res[0].message).toBe('"body.name" is required')
            }
        })
    })

})