import dividendsType from "../enum/dividendsType";

/**
 * 
 * @param {number} value 
 * @param {number} mutiple 
 */
export const parseDecimalValues = (value, mutiple = 100) =>{
    if (Number(value) === value) {
        return parseInt((value * mutiple).toFixed(), 10);
    }

    return value;
};

/**
 * 
 * @param {string} date 
 * @param {string} format 
 * @param {string} delimiter 
 * @returns 
 */
export const stringToDate = (date, format, delimiter) =>{
    var formatLowerCase = format.toLowerCase();
    var formatItems = formatLowerCase.split(delimiter);
    var dateItems = date.split(delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
};

/**
 * 
 * @param {string} value 
 * @returns 
 */
export const formatAmount = (value) =>{
    return value
        .replace(",", "")
        .replace(" ", "")
        .substring(0, value.length - 7);
};

/**
 * 
 * @param {string} value 
 * @returns { import('../enum/dividendsType') }
 */
export const parseStringToDividendType = (value)=>{
    switch (value) {
        case "RENDIMENTO":
            return dividendsType.DIVIDEND;
        case "DIVIDENDO":
            return dividendsType.YIELD;
        case "JCP":
            return dividendsType.JCP;
        default:
            return dividendsType.YIELD;
    }
};