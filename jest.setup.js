import knex from 'knex'
import knexFile from './knexfile'
const conn = knex(knexFile.test)
import { executeSql, deleteFolders } from './test/utils'

beforeAll(async()=>{
    try {
        await executeSql('CREATE DATABASE IF NOT EXISTS test_example')
    } catch (error) {console.log(error)}
    await conn.migrate.up()
})

afterAll(async ()=>{
    try {
        deleteFolders([
            './src/public/uploads/multiple',
            './src/public/uploads/single',
            './src/public/zip',
            './src/public/pdf',
            './src/public/csv',
            './src/public/xlsx',
            './src/public/docx',
        ])
        await executeSql('DROP DATABASE IF EXISTS test_example')
    } catch (error) {console.log(error)}
})

