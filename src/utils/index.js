import dividendsType from "../enum/dividendsType";

/**
 * 
 * @param {number} percent 
 * @param {number} value 
 */
 export const parsePercent = (percent, value) =>{
    const val = (percent / 100) * value;
    if(isNaN(val) || val === Infinity){
        return 0;
    }
    return val;
};

/**
 * 
 * @param {number} value1 
 * @param {number} value2 
 */
 export const diffPercent = (value1, value2) =>{
    const val = ((value1 - value2) / value2) * 100;
    if(isNaN(val) || val === Infinity){
        return 0;
    }
    return val;
};

/**
 * 
 * @param {number} value 
 * @param {number} mutiple 
 */
export const parseFloatValue = (value) =>{
    const val = parseFloat(value / 100).toFixed(2);
    if(isNaN(val) || val === Infinity){
        return 0;
    }
    return val;
};

/**
 * 
 * @param {number} value 
 * @param {number} mutiple 
 */
export const parseDecimalValue = (value, mutiple = 100) =>{
    const val = parseInt((value * mutiple).toFixed(), 10);
    if(isNaN(val) || val === Infinity){
        return 0;
    }
    return val;
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

/**
 * 
 * @param {string} join 
 * @param {Array<string>} selects
 * @returns {string} 
 */
export const jsonObjectQuerySelect = (join, selects)=>{
    const data = [];

    selects.forEach((select)=>{
        data.push(`'${select}', ${join}.${select}`);
    });

    return "JSON_OBJECT("+ data + `) as ${join}`;
};

/**
 * 
 * @param {string} join 
 * @param {Array<string>} selects
 * @returns {string} 
 */
export const jsonObjectArrayQuerySelect = (join, selects)=>{
    const data = [];

    selects.forEach((select)=>{
        data.push(`'${select}', ${join}.${select}`);
    });

    return "JSON_ARRAYAGG(JSON_OBJECT("+ data + `)) as ${join}`;
};