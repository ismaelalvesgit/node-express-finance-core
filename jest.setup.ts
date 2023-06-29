import './src/import-first'
import knex from "@infrastructure/knex/knex"
import mysql from "mysql2";
import { Config } from '@config/config';
import { EnvironmentType } from '@config/types/config';

jest.mock('ioredis', () => require('ioredis-mock'))

const config = new Config()

const executeSql = (sql: string)=>{
    return new Promise((resolve, reject)=>{    
        if(config.get().environment == EnvironmentType.Test) {
            const query = mysql.createConnection({
                host: config.get().db.host,
                user: config.get().db.user,
                password: config.get().db.password,
                port: config.get().db.port,
            });

            query.execute(sql, (err, results)=>{
                if(err){
                    reject(err);
                    query.destroy();
                }
                query.destroy();
                resolve(results);
            });
        } else {
            resolve(null);
        }
    });
};

beforeAll(async()=>{
    await Promise.all([
        await executeSql(`CREATE DATABASE IF NOT EXISTS ${config.get().db.database}_test`),
        await knex.migrate.latest()
    ]);
})

afterAll(async()=>{
    await knex.destroy()
})