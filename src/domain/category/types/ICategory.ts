import { IEntity } from "@helpers/ICommon";

export const CategorySelect = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
];

export enum ECategoryType {
    FIIS = "FIIS",
    FII_AGRO = "FII_AGRO", // Fundos de Agronegócio
    FIP = "FIP", // Fundo de Investimento em Participações
    FIA = "FIA", // Fundos de Investimentos de Ações
    FIDC = "FIDC", // Fundo de Investimento em Direitos Creditórios
    FIINFRA = "FIINFRA", // Fundo de investimento em infraestrutura
    FUNDO_SETORIAL = "FUNDO_SETORIAL", // Fundos setoriais
    ACAO = "ACAO",
    CRIPTOMOEDA = "CRIPTOMOEDA",
    STOCKS = "STOCKS",
    REITS = "REITS",
    ETF = "ETF",
    ETF_EXT = "ETF_EXT",
    TESOURO = "BOND",
    INDEX = "INDEX",
    INDEX_EXT = "INDEX_EXT",
    BDR = "BDR",
}

export const CategoryIsBR = (category: ECategoryType)=>{
    if(
        category === ECategoryType.STOCKS ||
        category === ECategoryType.REITS ||
        category === ECategoryType.ETF_EXT ||
        category === ECategoryType.INDEX_EXT
    ) return false;

    return true;
};

export interface ICategory extends IEntity {
    name: ECategoryType
}