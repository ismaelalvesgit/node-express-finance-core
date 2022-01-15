import mysql from "mysql2";
import env from "../../src/env";
import { deleteFolder } from "../../src/utils";

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
 * 
 * @param {Array<string>} paths 
 */
export const deleteFolders = (paths) =>{
    paths.forEach((path)=>{
        deleteFolder(path)
    })
}

