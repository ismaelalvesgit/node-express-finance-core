import { format, addDays, subDays, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";

export default class DateHelper {
    
    static formatDate(date: Date | number,  fmt = "yyyy-MM-dd"){
        return format(date, fmt, {locale: ptBR});
    }

    static differenceInYears(dateLeft: Date | number, dateRight: Date | number){
        return differenceInYears(dateLeft, dateRight);
    }

    static addDays(date: Date | number, value: number){
        return addDays(date, value);
    }

    static subDays(date: Date | number, value: number){
        return subDays(date, value);
    }
}