import { Knex } from "knex";
import { createdAt, updatedAt } from "../utils";
import { ETransactionType } from "@domain/transaction/types/ITransaction";
import { EDividendsStatus, EDividendsType } from "@domain/dividends/types/IDividends";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("category", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("name").unique().notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("investment", (table) => {
    table.bigIncrements("id").unsigned();
    table.bigInteger("categoryId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("category")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.unique(["name", "categoryId"]);
    table.string("name").notNullable();
    table.string("longName").nullable();
    table.text("logoUrl").nullable();
    table.string("sector").notNullable().defaultTo("ChangeMe");
    table.string("currency", 6).nullable();
    table.decimal("balance", 20, 10).defaultTo(0).notNullable();
    table.decimal("priceDay", 20, 10).defaultTo(0).nullable();
    table.decimal("priceDayHigh", 20, 10).defaultTo(0).nullable();
    table.decimal("priceDayLow", 20, 10).defaultTo(0).nullable();
    table.decimal("changePercentDay").defaultTo(0).nullable();
    table.decimal("variationDay", 20, 10).defaultTo(0).nullable();
    table.decimal("changePercentTotal").defaultTo(0).nullable();
    table.decimal("variationTotal", 20, 10).defaultTo(0).nullable();
    table.decimal("volumeDay", 20, 10).defaultTo(0).nullable();
    table.decimal("previousClosePrice", 20, 10).defaultTo(0).nullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("broker", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("name").unique().notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("transaction", (table) => {
    table.bigIncrements("id").unsigned();
    table.bigInteger("brokerId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("broker")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.bigInteger("investmentId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("investment")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.enum("type", Object.keys(ETransactionType)).notNullable();
    table.date("negotiationDate").notNullable();
    table.decimal("brokerage", 20, 10).defaultTo(0).nullable();
    table.decimal("fees", 20, 10).defaultTo(0).nullable();
    table.decimal("taxes", 20, 10).defaultTo(0).nullable();
    table.decimal("profit", 20, 10).defaultTo(0).nullable();
    table.decimal("qnt", 20, 10).notNullable();
    table.decimal("price", 20, 10).notNullable();
    table.decimal("total", 20, 10).notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("dividends", (table) => {
    table.bigIncrements("id").unsigned();
    table.bigInteger("brokerId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("broker")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.bigInteger("investmentId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("investment")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.enum("status", Object.keys(EDividendsStatus)).defaultTo(EDividendsStatus.PROVISIONED).notNullable();
    table.enum("type", Object.keys(EDividendsType)).notNullable();
    table.date("dateBasis").notNullable();
    table.date("dueDate").notNullable();
    table.decimal("qnt", 20, 10).notNullable();
    table.decimal("price", 20, 10).notNullable();
    table.decimal("total", 20, 10).notNullable();
    table.decimal("fees", 20, 10).nullable().defaultTo(0);
    table.string("currency", 6).nullable().defaultTo("BRL");
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("events", (table) => {
    table.bigIncrements("id").unsigned();
    table.bigInteger("investmentId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("investment")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.date("dateReference").notNullable();
    table.date("dateDelivery").notNullable();
    table.string("link", 1000).notNullable();
    table.text("description").notNullable();
    table.unique(["link", "investmentId"]);
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("currencyFavorite", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("code").unique().notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("boundList", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("code").unique().notNullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("dividends");
  await knex.schema.dropTable("events");
  await knex.schema.dropTable("currencyFavorite");
  await knex.schema.dropTable("transaction");
  await knex.schema.dropTable("broker");
  await knex.schema.dropTable("investment");
  await knex.schema.dropTable("category");
}
