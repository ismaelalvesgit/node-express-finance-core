import { IIndexer, IIndexerResponse } from "@domain/investment/types/IInvest";
import { 
    IBcbIndex, 
    IBcbIndexResponse, 
    IBcbInflactionIndicator, 
    IBcbInflactionIndicatorResponse, 
    IBcbNews, 
    IBcbNewsResponse 
} from "../types/INews";

export default class BcbMapper {
    
    static indexerMapper(data: IIndexerResponse): IIndexer {
        return {
            monthly: data.monthly.map((month)=>{
                return {
                    year: month.y,
                    month: month.m,
                    date: month.date,
                    value: month.value
                };
            }),
            yearly: data.yearly.map((month)=>{
                return {
                    year: month.y,
                    month: month.m,
                    date: month.date,
                    value: month.value
                };
            })
        };
    }

    static indexMapper(data: IBcbIndexResponse[]): IBcbIndex[] {
        return data.map((selic)=> {return { date: selic.data, value: selic.valor};});
    }
    
    static inflactionIndicatorMapper({
        titulo,
        anoMeta,
        taxaMeta,
        margemErro,
        taxaInflacao,
        Acumulada
    } : IBcbInflactionIndicatorResponse): IBcbInflactionIndicator {
        return {
            title: titulo,
            yearGoal: anoMeta,
            targetRate: taxaMeta,
            marginError: margemErro,
            rateInflation: taxaInflacao,
            accumulated: Acumulada,
        };
    }
    
    static newsMapper(data: IBcbNewsResponse[], bcbUrl: string): IBcbNews[] {
        return data.map((item)=>{ 
            const link = `${bcbUrl}${item.link}`;
            return {
                link,
                title: item.titulo,
                body: item.corpo,
                img: {
                    url: item.urlImg.Url,
                    description: item.urlImg.Description,
                },
            };
        });
    }
}
