import { EWhereOperator, IInnerJoinData, IPagination, IQueryData } from "@helpers/ICommon";
import { IReposioryBase } from "@infrastructure/types/IRepositoryBase";
import database from "@infrastructure/knex/knex";
import { Knex } from "knex";
import knex from "@infrastructure/knex/knex";

export default abstract class RepositoryBase<IEntity> implements IReposioryBase<IEntity> {
    
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    get context() {
        return database(this.tableName);
    }

    async create(data: IEntity): Promise<void> {
        await this.context.insert(data);
    }

    async update(id: string | number, data: IEntity): Promise<void> {
        await this.context.where({id}).update(data);
    }

    async delete(id: string | number): Promise<void> {
        await this.context.where({id}).del();
    }

    async find(params: Partial<IQueryData>): Promise<IPagination<IEntity>> {
        const query = this.context;
        const queryTotal = this.context;
        const page = Number(params.page || 1);
        const pageSize = Number(params.pageSize || 10);
        const orderByDescending = Boolean(params.orderByDescending || "false");

        query.select(`${this.tableName}.*`);
    
        this.innerJoin(query, queryTotal, params.join)
        this.orderByName(query, orderByDescending, params.orderBy)
        this.whereByName(query, queryTotal, params.filterBy)


        query.offset((page - 1) * pageSize);
        query.limit(pageSize);

        return this.toPaginated(query, queryTotal, page, pageSize);
    }

    private orderByName(query: Knex.QueryBuilder, orderByDescending: boolean, orderBy?: string){
        if(orderBy) {
            const columnName = orderBy.search(/\./) > 0 ? orderBy : `${this.tableName}.${orderBy}`;
            query.orderBy(columnName, orderByDescending == true ? "desc" : "asc");
        } else {
            query.orderBy(`${this.tableName}.id`, orderByDescending == true ? "desc" : "asc");
        }
    }

    private innerJoin(query: Knex.QueryBuilder, queryTotal: Knex.QueryBuilder, join?: IInnerJoinData[]){
        if(Array.isArray(join) && join.length > 0) {
            join.forEach((item)=>{
                query.innerJoin(
                    item.tableName, 
                    `${item.tableName}.${item.key}`, 
                    `${this.tableName}.${item.reference}`
                );
                queryTotal.innerJoin(
                    item.tableName, 
                    `${item.tableName}.${item.key}`, 
                    `${this.tableName}.${item.reference}`
                );

                if(item.columns.length > 0) {
                    query.select(knex.raw(this.jsonObjectQuerySelect(item.tableName, item.columns)));
                }
            });
        }
    }

    private whereByName(query: Knex.QueryBuilder, queryTotal: Knex.QueryBuilder, filterBy?: string[]){
        if(Array.isArray(filterBy) && filterBy.length > 0) {
            filterBy.forEach((where)=>{
                // Name eq Raquel
                const split = where.split(" ");
                if(split.length > 2) {
                    const columnName = split[0].search(/\./) > 0 ? split[0] : `${this.tableName}.${split[0]}`;
                    const condition = this.WhereOperator(split[1]);
                    const value = split.slice(2, split.length).join(" ");
                    query.where(columnName, condition, condition === "like" ? `%${value}%` : value);
                    queryTotal.where(columnName, condition, condition === "like" ? `%${value}%` : value);
                }
            });
        }
    }

    private async toPaginated(
        query: Knex.QueryBuilder, 
        queryTotal: Knex.QueryBuilder, 
        page: number, 
        pageSize: number
    ): Promise<IPagination<IEntity>> {
        const [items, count] = await Promise.all([
            query,
            queryTotal.count(`${this.tableName}.id`, {as: "id"}).first()
        ]);

        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const totalCount = Number(count.id);
        const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
        
        let nextPage: number | undefined = undefined;
        let previousPage: number | undefined = undefined;

        if (startIndex > 0) {
            previousPage = page - 1;
        }

        if (endIndex < totalCount) {
            nextPage = page + 1;
        }

        return {
            currentPage: page,
            totalPages,
            totalCount,
            nextPage,
            previousPage,
            items
        };
    }

    private WhereOperator(where: string): string {
        switch(where.toLocaleLowerCase()){
            case EWhereOperator.Equal: 
                return "=";
            case EWhereOperator.NotEqual: 
                return "<>";
            case EWhereOperator.GreaterThan: 
                return ">";
            case EWhereOperator.GreaterThanOrEqual: 
                return ">=";
            case EWhereOperator.LessThan: 
                return "<";
            case EWhereOperator.LessThanOrEqual: 
                return "<=";
            case EWhereOperator.Like: 
                return "like";
            default: 
                return "=";
        }
    }

    private jsonObjectQuerySelect(name: string, selects: string[]): string {
        const data: string[] = [];

        selects.forEach((select)=>{
            data.push(`'${select}', ${name}.${select}`);
        });

        return "JSON_OBJECT("+ data + `) as ${name}`;
    }

    async findById(id: number | string, join?: IInnerJoinData[]): Promise<IEntity> {
        const query = this.context.select(`${this.tableName}.*`).where({[`${this.tableName}.id`]: id}).first();
        
        if(Array.isArray(join) && join.length > 0) {
            join.forEach((item)=>{
                query.innerJoin(
                    item.tableName, 
                    `${item.tableName}.${item.key}`, 
                    `${this.tableName}.${item.reference}`
                );

                if(item.columns.length > 0) {
                    query.select(knex.raw(this.jsonObjectQuerySelect(item.tableName, item.columns)));
                }
            });
        }

        return await query;
    }
    
}