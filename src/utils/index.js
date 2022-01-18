
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
 * @param {string} value 
 * @returns 
 */
export const parseDateFiis = (value) =>{
    if(typeof value === "string" && value.length === 8){
        let temp = value.split("/");
        return `20${temp[2]}-${temp[1]}-${temp[0]}`;
    }
    return value;
};

/**
 * 
 * @param {string} value 
 * @returns 
 */
export const formatAmount = (value) =>{
    return value.replace(",", "").replace(" ", "").substr(2);
};