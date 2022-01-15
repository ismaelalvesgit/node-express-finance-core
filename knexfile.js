require("@babel/register");
const env = require('./src/env');

module.exports = {
    local:{
        client: 'mysql2',
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: env.default.db.database,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        migrations: {
            tableName: 'migrations',
        },
        debug: env.default.db.debug
    },
    test:{
        client: 'mysql2',
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: `test_${env.default.db.database}`,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        migrations: {
            tableName: 'migrations',
        }
    }
};