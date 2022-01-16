import knex from 'knex'
import knexFile from './knexfile'
import env from './src/env'
const conn = knex(knexFile.test)
import { executeSql } from './test/utils'

beforeAll(async()=>{
    try {
        await executeSql(`CREATE DATABASE IF NOT EXISTS test_${env.db.database}`)
    } catch (error) {console.log(error)}
    await conn.migrate.up()
})

afterAll(async ()=>{
    try {
        await executeSql(`DROP DATABASE IF EXISTS test_${env.db.database}`)
    } catch (error) {console.log(error)}
})

