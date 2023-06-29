import { Knex } from "knex";
import { createdAt, updatedAt } from "../utils";

export async function up(knex: Knex): Promise<void> {
    /**
     * Table Category
     */
    await knex.schema.createTable('category', (table)=>{
        table.bigIncrements('id').unsigned();
        table.string('name').unique().notNullable();
        table.text('imageUrl').nullable();
        createdAt(knex, table);
        updatedAt(knex, table);
    })
    
    /**
     * Table Product
     */
    await knex.schema.createTable('product', (table)=>{
        table.bigIncrements('id').unsigned();
        table.bigInteger("categoryId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("category")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.string('name').unique().notNullable();
        table.unique(["name", "categoryId"]);
        table.text('description').nullable();
        table.text('imageUrl').nullable();
        table.decimal("price", 20, 10).defaultTo(0).notNullable();
        table.decimal("quantity", 20, 10).notNullable();
        createdAt(knex, table);
        updatedAt(knex, table);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("product");
    await knex.schema.dropTable("category");
}

