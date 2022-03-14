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
    table.float("balance").defaultTo(0).notNullable();
    table.float("priceDay").defaultTo(0).nullable();
    table.float("priceDayHigh").defaultTo(0).nullable();
    table.float("priceDayLow").defaultTo(0).nullable();
    table.decimal("changePercentDay").defaultTo(0).nullable();
    table.float("variationDay").defaultTo(0).nullable();
    table.decimal("changePercentTotal").defaultTo(0).nullable();
    table.float("variationTotal").defaultTo(0).nullable();
    table.float("volumeDay").defaultTo(0).nullable();
    table.float("previousClosePrice").defaultTo(0).nullable();
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
    table.float("brokerage").defaultTo(0).nullable();
    table.float("fees").defaultTo(0).nullable();
    table.float("taxes").defaultTo(0).nullable();
    table.float("profit").defaultTo(0).nullable();
    table.float("qnt").notNullable();
    table.float("price").notNullable();
    table.float("total").notNullable();
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
    table.float("price").notNullable();
    table.float("total").notNullable();
    table.float("fees").nullable().defaultTo(0);
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
