import { IInnerJoinData, IPagination, IQueryData } from "@helpers/ICommon";
import { Knex } from "knex";

export interface IReposioryBase <IEntity> {
    get context(): Knex.QueryBuilder
    find(params: Partial<IQueryData>): Promise<IPagination<IEntity>>
    findById(id: number | string, join?: IInnerJoinData[]): Promise<IEntity>
    create(data: IEntity): Promise<void>
    update(id: number | string, data: IEntity ): Promise<void>
    delete(id: number | string): Promise<void>
}