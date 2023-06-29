import './src/import-first'
import 'tsconfig-paths/register'
import { Config } from "@config/config";
import { Logger } from "@infrastructure/logger/logger";
import { Knex } from "knex";

const config = new Config();

const local: Knex.Config = {
    client: "mysql2",
    connection: {
        host: config.get().db.host,
        port: config.get().db.port,
        user: config.get().db.user,
        password: config.get().db.password,
        database: config.get().db.database,
        supportBigNumbers: true,
        bigNumberStrings: true,
        multipleStatements: true,
        dateStrings: true
    },
    pool:{
        afterCreate: function(connection: any, callback: any) {
            connection.query(`SET time_zone = "${config.get().timezone}";`, function(err: unknown) {
                if (err) {
                    Logger.warn(err, "failed to initialize mysql database connection");
                } else {
                    Logger.debug("mysql database connected");
                }
                callback(err, connection);
            });
        },
        min: config.get().db.pool.min,
        max: config.get().db.pool.max
    },
    migrations: {
        tableName: "migrations",
        directory: `${__dirname}/db/migrations`
    },
    seeds: {
        directory: `${__dirname}/db/seeds`
    },
    debug: config.get().db.debug
};

export default {
    local,
    test: {
        ...local,
        connection: {
            host: config.get().db.host,
            port: config.get().db.port,
            user: config.get().db.user,
            password: config.get().db.password,
            database: `${config.get().db.database}_test`,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        }
    }
};