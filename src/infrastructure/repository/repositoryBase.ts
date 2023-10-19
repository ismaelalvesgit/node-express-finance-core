import { EWhereOperator, IInnerJoinData, IPagination, IQueryData } from "@helpers/ICommon";
import { IReposioryBase, IReposioryBaseOptions } from "@infrastructure/types/IRepositoryBase";
import database from "@infrastructure/knex/knex";
import { Knex } from "knex";
import knex from "@infrastructure/knex/knex";
import Common from "@helpers/Common";
import R from "ramda";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";

export default abstract class RepositoryBase<IEntity> implements IReposioryBase<IEntity> {

    private tableName: string;
    private pageSize: number;
    private readonly: boolean;
    private jsonAttributes?: string[];
    private redisClient?: IRedisAdapter;

    constructor(tableName: string, options?: Partial<IReposioryBaseOptions>) {
        this.tableName = tableName;
        this.pageSize = options?.pageSize ?? 50;
        this.readonly = options?.readonly ?? false;
        this.redisClient = options?.redis;
        this.jsonAttributes = options?.jsonAttributes;
    }

    transaction<T>(callback: (trx: Knex.Transaction) => void | Promise<T>, config?: Knex.TransactionConfig): Promise<T> {
        return knex.transaction(callback, config);
    }

    private isReadonly(){
        if(this.readonly) throw new Error("Method not implemented.");
    }

    get tbName() {
        return this.tableName;
    }

    get context() {
        return database(this.tableName);
    }

    async batchCreate(data: IEntity[]): Promise<void> {
        this.isReadonly();
        await knex.transaction((trx) => {
            return Promise.all(data.map(async (item) => {
                return this.findOrCreate(item, trx);
            }));
        });
    }

    async create(data: IEntity, trx?: Knex.Transaction): Promise<void> {
        this.isReadonly();
        await Common.transacting(this.context.insert(R.reject(R.isNil, data as object)), trx);
        await this.redisClient?.deleteByPrefix(this.tableName);
    }

    async update(id: string | number, data: IEntity, trx?: Knex.Transaction): Promise<void> {
        this.isReadonly();
        await Common.transacting(this.context.where({ id }).update(R.reject(R.isNil, data as object)), trx);
        await this.redisClient?.deleteByPrefix(this.tableName);
    }

    async delete(id: string | number, trx?: Knex.Transaction): Promise<void> {
        this.isReadonly(); 
        await Promise.all([
            Common.transacting(this.context.where({ id }).del(), trx),
            this.redisClient?.deleteByPrefix(this.tableName)
        ]);
    }

    async findOrCreate(data: Partial<IEntity>, trx?: Knex.Transaction<any, any[]>, find?: Partial<IEntity>) {
        this.isReadonly();
        return Common.transacting(this.context.where((find || data) as object).first(), trx).then((res?: IEntity) => {
            if (!res) {
                return this.create(data as IEntity, trx).then(() => {
                    return Common.transacting(this.context.where(data as object).first(), trx);
                });
            }
            return res;
        });
    }

    async find(params: Partial<IQueryData>, trx?: Knex.Transaction): Promise<IPagination<IEntity>> {
        const query = Common.transacting(this.context, trx);
        const queryTotal = Common.transacting(this.context, trx);
        const page = Number(params.page || 1);
        const pageSize = Number(params.pageSize || this.pageSize);
        const orderByDescending = Boolean(params.orderByDescending || "false");

        query.select(`${this.tableName}.*`);

        this.innerJoin(query, queryTotal, params.join);
        this.orderByName(query, orderByDescending, params.orderBy);
        this.whereByName(query, queryTotal, params.filterBy);

        query.offset((page - 1) * pageSize);
        query.limit(pageSize);

        return this.toPaginated(query, queryTotal, page, pageSize);
    }

    private orderByName(query: Knex.QueryBuilder, orderByDescending: boolean, orderBy?: string) {
        if (orderBy) {
            const columnName = orderBy.search(/\./) > 0 ? orderBy : `${this.tableName}.${orderBy}`;
            query.orderBy(columnName, orderByDescending == true ? "desc" : "asc");
        } else {
            query.orderBy(`${this.tableName}.id`, orderByDescending == true ? "desc" : "asc");
        }
    }

    private innerJoin(query: Knex.QueryBuilder, queryTotal: Knex.QueryBuilder, join?: IInnerJoinData[]) {
        if (Array.isArray(join) && join.length > 0) {
            join.forEach((item) => {
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

                if (item.columns.length > 0) {
                    query.select(knex.raw(Common.jsonQuerySelect(item.tableName, item.columns)));
                }
            });
        }
    }

    private whereByName(query: Knex.QueryBuilder, queryTotal: Knex.QueryBuilder, filterBy?: string[]) {
        if (Array.isArray(filterBy) && filterBy.length > 0) {
            filterBy.forEach((where) => {
                // Name eq Raquel
                const split = where.split(" ");
                if (split.length > 2) {
                    const condition = this.WhereOperator(split[1]);
                    const value = condition === EWhereOperator.In ? 
                        split.slice(2, split.length).join(" ").split(",") : 
                        split.slice(2, split.length).join(" ");

                    const attributes = split[0].split(".");
                    
                    if(attributes.length > 1 && this.jsonAttributes?.includes(attributes[0])){
                        // json search
                        const key = `${attributes[0]}->>`;
                        const column = "\"$." + attributes[1] + "\"";
                        const valuesProp = `${Array.isArray(value) ? `(${value.map(_ => "?").join(",")})` : "?"}`;
                        query.whereRaw(`${key}${column} ${condition} ${valuesProp}`, value);
                        queryTotal.whereRaw(`${key}${column} ${condition} ${valuesProp}`, value);
                    }else{
                        const columnName = attributes.length > 1 ? split[0] : `${this.tableName}.${split[0]}`;
                        query.where(columnName, condition, condition === "like" ? `%${value}%` : value);
                        queryTotal.where(columnName, condition, condition === "like" ? `%${value}%` : value);
                    }
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
            queryTotal.count(`${this.tableName}.id`, { as: "id" }).first()
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
        switch (where.toLocaleLowerCase()) {
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
            case EWhereOperator.In:
                return "in";
            case EWhereOperator.Like:
                return "like";
            default:
                return "=";
        }
    }

    async findOne(filter: Partial<IEntity>, join?: IInnerJoinData[], trx?: Knex.Transaction): Promise<IEntity> {
        const query = this.context.select(`${this.tableName}.*`).where(filter).first();

        if (Array.isArray(join) && join.length > 0) {
            join.forEach((item) => {
                query.innerJoin(
                    item.tableName,
                    `${item.tableName}.${item.key}`,
                    `${this.tableName}.${item.reference}`
                );

                if (item.columns.length > 0) {
                    query.select(knex.raw(Common.jsonQuerySelect(item.tableName, item.columns)));
                }
            });
        }

        return await Common.transacting(query, trx);
    }

    async findById(id: number | string, join?: IInnerJoinData[], trx?: Knex.Transaction): Promise<IEntity> {
        const query = this.context.select(`${this.tableName}.*`).where({ [`${this.tableName}.id`]: id }).first();

        if (Array.isArray(join) && join.length > 0) {
            join.forEach((item) => {
                query.innerJoin(
                    item.tableName,
                    `${item.tableName}.${item.key}`,
                    `${this.tableName}.${item.reference}`
                );

                if (item.columns.length > 0) {
                    query.select(knex.raw(Common.jsonQuerySelect(item.tableName, item.columns)));
                }
            });
        }

        return await Common.transacting(query, trx);
    }
}
