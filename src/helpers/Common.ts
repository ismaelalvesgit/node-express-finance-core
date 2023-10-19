import { ECategoryType } from "@domain/category/types/ICategory";
import { Request } from "express";
import { Knex } from "knex";

export default class Common {

    static jsonQuerySelect(name: string, selects: string[], alias = true, subSelects: string[] = [], ): string {
        const data: string[] = [];

        selects.forEach((select)=>{
            data.push(`'${select}', ${name}.${select}`);
        });

        if(subSelects.length > 0){
            const subName = subSelects[0].split(".")[0];
            const subSelect = subSelects.map((sub) => sub.split(".")[1]);
            const json_object = this.jsonQuerySelect(subName, subSelect, false);
            data.push(`'${subName}', ${json_object}`);
        }

        if(alias) return "JSON_OBJECT("+ data + `) as ${name}`;

        return "JSON_OBJECT("+ data + ")";
    }

    static jsonArrayQuerySelect(name: string, selects: string[]): string {
        const data: string[] = [];

        selects.forEach((select)=>{
            data.push(`'${select}', ${name}.${select}`);
        });

        return "JSON_ARRAYAGG(JSON_OBJECT("+ data + `)) as ${name}`;
    }

    static getFilterBy(req: Request) : string[] | undefined {
        return (Array.isArray(req.query.filterBy) 
            ? req.query.filterBy : 
            req.query.filterBy != undefined ? 
            [req.query.filterBy] : 
            undefined) as string[] | undefined;
    }

    static transacting(query: Knex.QueryBuilder, trx?: Knex.Transaction){
        if(trx){
            query.transacting(trx);
        }
        return query;
    }

    static parsePercent(percent: number, value: number){
        const val = (percent / 100) * value;
        if(isNaN(val) || val === Infinity){
            return 0;
        }
        return val;
    }

    static categoryIsBR(category: ECategoryType){
        if(
            category === ECategoryType.STOCKS ||
            category === ECategoryType.REITS ||
            category === ECategoryType.INDEX_EXT ||
            category === ECategoryType.ETF_EXT
        ) return false
        
        return true
    }
}
