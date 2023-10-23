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