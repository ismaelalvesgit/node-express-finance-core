import mysql from "mysql2";
import env from "../../src/env";
import { ValidadeSchema } from "../../src/utils/erro";

/**
 * 
 * @param {string} sql 
 */
export const executeSql = (sql)=> {
    return new Promise((resolve, reject)=>{
        const query = mysql.createConnection({
            host: env.db.host,
            user: env.db.user,
            password: env.db.password,
            port: env.db.port,
        });
    
        query.execute(sql, (err, results)=>{
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
};

/**
 * @param {import('@hapi/joi').AnySchema} schema 
 */
export const validateSchema = (schema, data)=>{
    const validation = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true
    });

    if (validation.error) {
        throw new ValidadeSchema(validation.error.details[0].message.replace(/"/g, ""));
    }

    return validation.value;
};