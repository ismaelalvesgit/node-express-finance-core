import { injectable } from "tsyringe";
import { ISystemRepository } from "../types/ISystemRepository";
import knex from "@infrastructure/knex/knex";

@injectable()
export default class SystemRepository implements ISystemRepository {
    healthcheck(): Promise<void> {
        return knex.raw("select 1+1 as result");
    }
}