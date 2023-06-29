import { Knex } from "knex";

export const createdAt = (knex: Knex, table: Knex.TableBuilder) => {
    table.timestamp('createdAt', { precision: 3 })
    .notNullable()
    .defaultTo(knex.fn.now(3))
};

export const updatedAt = (knex: Knex, table: Knex.TableBuilder) => {
    table.timestamp('updatedAt', { precision: 3 })
    .notNullable()
    .defaultTo(knex.raw('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'))
};

