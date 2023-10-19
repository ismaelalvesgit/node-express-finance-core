import Common from "@helpers/Common";
import { Knex } from "knex";

const TABLE_NAME = "investment";
const selectDefault = [
    "id",
    "name",
    "longName",
    "logoUrl",
    "balance",
    "currency",
    "sector",
    "volumeDay",
    "changePercentDay",
    "variationDay",
    "changePercentTotal",
    "variationTotal",
    "previousClosePrice",
    "priceDay",
    "priceDayHigh",
    "priceDayLow",
    "createdAt",
    "updatedAt",
];

const categoryModel = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
]

export async function up(knex: Knex): Promise<void> { 
    return knex.schema.createView("view_investment", (view) => {
        view.columns([
            "category",
            ...selectDefault,
            "variationDayTotal",
            "priceAverage",
            "qnt",
            "tradingAmount",
            "percent",
            "percentCategory"
        ]);
        view.as(knex(TABLE_NAME)
            .select([
                knex.raw(Common.jsonQuerySelect("category", categoryModel)),
                ...selectDefault.map((select) => {
                    return `${TABLE_NAME}.${select}`;
                }),
                knex.raw(`TRUNCATE(SUM(transaction.qnt * ${TABLE_NAME}.variationDay), 2) as variationDayTotal`),
                knex.raw("TRUNCATE(SUM((transaction.total + transaction.fees + transaction.brokerage + transaction.taxes)) / SUM(transaction.qnt), 2) as priceAverage"),
                knex.raw("SUM(transaction.qnt) as qnt"),
                knex.raw("TRUNCATE(SUM(transaction.profit), 2) as tradingAmount"),
                knex.raw(`TRUNCATE((balance / (select sum(balance) from ${TABLE_NAME}) * 100 ), 2) as 'percent'`),
                knex.raw(`TRUNCATE((balance / (select sum(balance) from ${TABLE_NAME} where categoryId = category.id) * 100 ), 2) as 'percentCategory'`)
            ])
            .leftJoin("transaction", "transaction.investmentId", "=", `${TABLE_NAME}.id`)
            .innerJoin("category", "category.id", "=", `${TABLE_NAME}.categoryId`)
            .groupBy(`${TABLE_NAME}.id`));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropView("view_investment");
}
