export interface ITickerSearch {
    id: number,
    parentId: number,
    nameFormated: string,
    name: string,
    normalizedName: string,
    code: string,
    price: string,
    variation: string,
    variationUp: boolean,
    type: number,
    url: string
}

export interface IIndexerParams {
    period: EIndexerPeriod,
    type: EIndexerType,
}

export interface IIndexParams {
    period: EIndexPeriod,
    type: EIndexType,
}

export enum EIndexType {
    BDRX = "indice-de-bdrs-nao-patrocinados-global",
    IFIX = "ifix",
    IBOV = "ibovespa",
    SP500 = "sp-500",
}

export enum EIndexerType {
    IPCA = "IPCA",
    CDI = "CDI"
}

// -1=1D, 0=5D, 1=30D, 2=60D, 3=1A, 4=5A
export enum EIndexPeriod {
    ONE_DAY = -1,
    FIVE_DAYS = 0,
    THIRTY_DAYS = 1,
    SEVENTY_DAYS = 2,
    ONE_YEAR = 3,
    FIVE_YEARS = 4,
}

// 0=ano_passado/ano_atual, 1=5A, 2=10A
export enum EIndexerPeriod {
    ONE_YEAR = 0,
    FIVE_YEARS = 1,
    TEN_YEARS = 2,
}

export interface IIndex {
    price: number,
    date: string
}

export interface IIndexerData {
    year: number,
    month: number,
    value: number,
    date: string,
}

export type IIndexerDataResponse = {
    y: number,
    m: number,
} & Pick<IIndexerData, "value" | "date">

export interface IIndexer {
    monthly: IIndexerData[],
    yearly: IIndexerData[]
}

export interface IIndexerResponse {
    monthly: IIndexerDataResponse[],
    yearly: IIndexerDataResponse[]
}
