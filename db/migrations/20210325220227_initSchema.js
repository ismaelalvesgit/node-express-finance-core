import dividendsType from "../../src/enum/dividendsType";
import dividendsStatus from "../../src/enum/dividendsStatus";
import transactionType from "../../src/enum/transactionType";

const createdAt = (knex, table) => table.timestamp("createdAt", { precision: 3 })
  .notNullable()
  .defaultTo(knex.fn.now(3));

const updatedAt = (knex, table) => table.timestamp("updatedAt", { precision: 3 })
  .notNullable()
  .defaultTo(knex.raw("CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"));

/**
* @param {import('knex').Knex} knex
*/
exports.up = async function (knex) {
  await knex.schema.createTable("category", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("name").notNullable();
    table.unique("name");
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
    table.decimal("balance").defaultTo(0).notNullable();
    table.decimal("priceDay", 14, 7).defaultTo(0).nullable();
    table.decimal("priceDayHigh", 14, 7).defaultTo(0).nullable();
    table.decimal("priceDayLow", 14, 7).defaultTo(0).nullable();
    table.decimal("changePercentDay").defaultTo(0).nullable();
    table.decimal("variationDay", 14, 7).defaultTo(0).nullable();
    table.decimal("changePercentTotal").defaultTo(0).nullable();
    table.decimal("variationTotal", 14, 7).defaultTo(0).nullable();
    table.decimal("volumeDay", 14, 7).defaultTo(0).nullable();
    table.decimal("previousClosePrice", 14, 7).defaultTo(0).nullable();
    createdAt(knex, table);
    updatedAt(knex, table);
  });

  await knex.schema.createTable("broker", (table) => {
    table.bigIncrements("id").unsigned();
    table.string("name").notNullable();
    table.unique("name");
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
    table.enum("type", Object.keys(transactionType)).notNullable();
    table.date("negotiationDate").notNullable();
    table.decimal("brokerage", 14, 7).defaultTo(0).nullable();
    table.decimal("fees", 14, 7).defaultTo(0).nullable();
    table.decimal("taxes", 14, 7).defaultTo(0).nullable();
    table.decimal("profit", 14, 7).defaultTo(0).nullable();
    table.decimal("qnt", 14, 7).notNullable();
    table.decimal("price", 14, 7).notNullable();
    table.decimal("total", 14, 7).notNullable();
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
    table.enum("status", Object.keys(dividendsStatus)).defaultTo(dividendsStatus.PROVISIONED).notNullable();
    table.enum("type", Object.keys(dividendsType)).notNullable();
    table.date("dateBasis").notNullable();
    table.date("dueDate").notNullable();
    table.float("qnt").notNullable();
    table.decimal("price").notNullable();
    table.decimal("total").notNullable();
    table.decimal("fees").nullable().defaultTo(0);
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
    table.bigInteger("assetMainId").notNullable();
    table.unique(["assetMainId", "investmentId"]);
    table.date("dateReference").notNullable();
    table.date("dateDelivery").notNullable();
    table.text("link").notNullable();
    table.text("description").notNullable();
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

};

/**
* @param {import('knex').Knex} knex
*/
exports.down = async function (knex) {
  await knex.schema.dropTable("dividends");
  await knex.schema.dropTable("events");
  await knex.schema.dropTable("currencyFavorite");
  await knex.schema.dropTable("transaction");
  await knex.schema.dropTable("broker");
  await knex.schema.dropTable("investment");
  await knex.schema.dropTable("category");
};
