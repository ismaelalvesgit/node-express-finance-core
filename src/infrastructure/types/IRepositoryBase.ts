import { IInnerJoinData, IPagination, IQueryData } from "@helpers/ICommon";
import { Knex } from "knex";
import { IRedisAdapter } from "./IRedisAdapter";

export interface IReposioryBaseOptions {
    pageSize: number
    readonly: boolean
    redis: IRedisAdapter
    jsonAttributes?: string[]
}

export interface IReposioryBase <IEntity> {
    get tbName(): string
    get context(): Knex.QueryBuilder
    find(params: Partial<IQueryData>, trx?: Knex.Transaction): Promise<IPagination<IEntity>>
    findOne(filter: Partial<IEntity>, join?: IInnerJoinData[], trx?: Knex.Transaction): Promise<IEntity>
    findById(id: number | string, join?: IInnerJoinData[], trx?: Knex.Transaction): Promise<IEntity>
    findOrCreate(data: Partial<IEntity>, trx?: Knex.Transaction, find?: IEntity): Promise<IEntity>
    batchCreate(data: IEntity[]): Promise<void>
    create(data: Partial<IEntity>, trx?: Knex.Transaction): Promise<void>
    update(id: number | string, data: Partial<IEntity>, trx?: Knex.Transaction): Promise<void>
    delete(id: number | string, trx?: Knex.Transaction): Promise<void>
    transaction<IEntity>(callback: (trx: Knex.Transaction) => void | Promise<IEntity>, config?: Knex.TransactionConfig): Promise<IEntity>
}