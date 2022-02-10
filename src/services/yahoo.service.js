import HttpAdapter from "../utils/axios";
import R from "ramda";
import { YahooApi } from "../utils/erro";
import env from "../env";

/**
 * @typedef Quote
 * @type {Object}
 * @property {Number} symbol
 * @property {String} shortName
 * @property {String} quoteType
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


const http = new HttpAdapter(env.yahoo, {
    "X-API-KEY": env.yahooKey
});

/**
 * 
 * @param {string} name 
 * @returns {Promise<Quote>}
 */
export const findQoute = async (name)=>{
    try {
        const { data } = await http.send({
            url: "/v6/finance/quote",
            params: {
                region: "US",
                lang: "en",
                symbols: name,
            },
            method: "GET"
        });
        const regularMarketTime = new Date(Number(data.quoteResponse.result[0].regularMarketTime) * 1000).toISOString();
        return Object.assign(data.quoteResponse.result[0], {
            regularMarketTime
        });
    } catch (error) {
        const defaultMessage = "Failed to get quote";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new YahooApi({statusCode: error?.response?.status, message});
    }
};