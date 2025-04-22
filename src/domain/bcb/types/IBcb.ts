
export interface IBcbIndexResponse {
    data: string
    valor: number
}

export interface IBcbResponse<T> {
    conteudo: T[]
} 

export interface IBcbInflactionIndicatorResponse {
    titulo: string
    anoMeta: number
    taxaMeta: number
    margemErro: number
    taxaInflacao: number
    Acumulada: number
}

export interface IBcbInflactionIndicatorResponse {
    titulo: string
    anoMeta: number
    taxaMeta: number
    margemErro: number
    taxaInflacao: number
    Acumulada: number
}

export interface IBcbInflactionIndicator {
    title: string
    yearGoal: number
    targetRate: number
    marginError: number
    rateInflation: number
    accumulated: number
}

export interface IBcbNewsResponseUrlImg {
    Url: string
    Description: string
}

export interface IBcbNewsResponse {
    link: string
    titulo: string
    corpo: string
    urlImg: IBcbNewsResponseUrlImg
}

export interface IBcbIndexResponse {
    link: string
    titulo: string
    corpo: string
    urlImg: IBcbNewsResponseUrlImg
}

export interface IBcbImgNews {
    url: string
    description: string
}

export interface IBcbNews {
    title: string
    body: string
    img: IBcbImgNews
    link: string
}

export interface IBcbIndex {
    date: string
    value: number
}

export interface IBcbIndexParams{
    dateStart?: string
    dateEnd?: string 
    type: EBcbIndexType
}

export enum EBcbIndexType {
    SELIC = 432,
    INFLACTION = 13522,
}


