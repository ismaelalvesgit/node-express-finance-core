import R from "ramda";
import { Brapi } from "../utils/erro";
import HttpAdapter from "../utils/axios";
import env from "../env";

/**
 * @typedef Quote
 * @type {Object}
 * @property {Number} symbol
 * @property {String} shortName
 * @property {String} longName
 * @property {String} currency
 * @property {Number} regularMarketPrice
 * @property {String} regularMarketDayHigh
 * @property {String} regularMarketDayLow
 * @property {String} regularMarketDayRange
 * @property {Number} regularMarketChange
 * @property {String} regularMarketChangePercent
 * @property {String} regularMarketTime
 * @property {String} marketCap
 * @property {Number} regularMarketVolume
 * @property {String} regularMarketPreviousClose
 * @property {String} regularMarketOpen
 * @property {String} averageDailyVolume10Day
 * @property {String} averageDailyVolume3Month
 * @property {String} fiftyTwoWeekLowChange
 * @property {String} fiftyTwoWeekLowChangePercent
 * @property {String} fiftyTwoWeekRange
 * @property {String} fiftyTwoWeekHighChange
 * @property {String} fiftyTwoWeekHighChangePercent
 * @property {String} fiftyTwoWeekLow
 * @property {String} fiftyTwoWeekHigh
 * @property {String} twoHundredDayAverage
 * @property {String} twoHundredDayAverageChange
 * @property {String} twoHundredDayAverageChangePercent
 */

const http = new HttpAdapter({
    baseUrl: env.brapi
});

/**
 * 
 * @param {string} name 
 * @returns {Promise<Quote>}
 */
export const findQoute = async (name)=>{
    try {
        const response = await http.send({
            url: `/quote/${name.toLocaleUpperCase()}`,
            method: "GET"
        });
        return response.data.results[0];
    } catch (error) {
        const defaultMessage = "Failed to get quote";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new Brapi({statusCode: error?.response?.status, message});
    }
};