
/**
 * 
 * @param {number} value 
 */
export const parseDecimalValues = (value) =>{
    if (Number(value) === value) {
        return parseInt((value * 100).toFixed(), 10)
    }

    return value
}