import knex from "knex";
import env from "./env";
import knexfile from "../knexfile";

let knexConn;
switch (env.env) {
    case "development":
        knexConn = knexfile.local;
        break;
    case "test":
        knexConn = knexfile.test;
        break;
    default:
        knexConn = knexfile.local;
        break;
}

const connection = knex(knexConn);

export default connection;