export interface IEntity {
    id: number
    createdAt: Date
    updatedAt: Date
}

export interface IPagination <T> {
    totalCount: number
    totalPages: number
    currentPage: number
    nextPage?: number
    previousPage?: number
    items: T[]
}

export interface IInnerJoinData { 
    tableName: string
    key: string
    reference: string
    columns: string[]
}

export interface IQueryData {
    page?: number
    pageSize?: number
    orderBy?: string
    filterBy?: string[]
    orderByDescending?: boolean
    join?: IInnerJoinData[]
}

export enum EWhereOperator {
    Equal = "eq",
    NotEqual = "ne",
    GreaterThan = "gt",
    GreaterThanOrEqual = "ge",
    LessThan = "lt",
    LessThanOrEqual = "le",
    Like = "lk"
}

export interface ICacheHandlerParams {
    path: string
    timeExp?: number
}