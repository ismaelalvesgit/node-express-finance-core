import { Knex, knex } from "knex";
import knexfile from "../../../knexfile";
import { Config } from "@config/config";
import { EnvironmentType } from "@config/types/config";

const config = new Config();

let knexConn: Knex.Config;
switch (config.get().environment) {
  case EnvironmentType.Develop:
    knexConn = knexfile.local;
    break;
  case EnvironmentType.Test:
    knexConn = knexfile.test;
    break;
  default:
    knexConn = knexfile.local;
    break;
}

export default knex(knexConn);