import R from "ramda";
import { Brapi } from "../utils/erro";
import HttpAdapter from "../utils/axios";
import env from "../env";

/**
 * @typedef Quote
 * @type {Object}
 * @property {string} symbol
 * @property {String} shortName
 * @property {String} logourl
 * @property {String} longName
 * @property {String} currency
 * @property {number} currencyRateFromUSD
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
 * @param {Array<Object>} data 
 * @returns { Array<Quote> }
 */
const _formatDataCoin = (data) => {
    return data.map((coin)=>{
        return {
            symbol: coin.coin,
            longName: coin.coinName,
            logourl: coin.coinImageUrl,
            currency: coin.currency,
            currencyRateFromUSD: coin.currencyRateFromUSD,
            regularMarketPrice: coin.regularMarketPrice,
            regularMarketDayHigh: coin.regularMarketDayHigh,
            regularMarketDayLow: coin.regularMarketDayLow,
            regularMarketDayRange: coin.regularMarketDayRange,
            regularMarketChange: coin.regularMarketChange,
            regularMarketChangePercent: coin.regularMarketChangePercent,
            regularMarketTime: new Date(Number(coin.regularMarketTime) * 1000).toISOString(),
            marketCap: coin.marketCap,
            regularMarketVolume: coin.regularMarketVolume,
        };
    });
};

/**
 * 
 * @param {string} name 
 * @returns {Promise<Quote>}
 */
export const findQoute = async (name) => {
    try {
        const { data } = await http.send({
            url: `/quote/${name.toLocaleUpperCase()}?fundamental=true`,
            method: "GET"
        });
        return data.results[0];
    } catch (error) {
        const defaultMessage = "Failed to get quote brapi";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new Brapi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @param {string} name 
 * @returns {Promise<Quote>}
 */
export const searchQoute = async (name) => {
    try {
        const { data } = await http.send({
            url: "/available",
            method: "GET",
            params: {
                search: name
            }
        });
        return data.stocks;
    } catch (error) {
        const defaultMessage = "Failed to search quote brapi";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new Brapi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @param {string} name 
 * @returns {Promise<QuoteCoin>}
 */
export const findQouteCoin = async (name) => {
    try {
        const { data } = await http.send({
            url: "v2/crypto",
            method: "GET",
            params: {
                coin: name,
                currency: "BRL"
            }
        });
        return  _formatDataCoin(data.coins)[0];
    } catch (error) {
        const defaultMessage = "Failed to get quote coin brapi";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new Brapi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @param {string} name 
 * @returns {Promise<[string]>}
 */
export const searchQouteCoin = async (name) => {
    try {
        const { data } = await http.send({
            url: "v2/crypto/available",
            method: "GET",
            params: {
                search: name
            }
        });
        return data.coins;
    } catch (error) {
        const defaultMessage = "Failed to search quote coin brapi";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new Brapi({ statusCode: error?.response?.status, message });
    }
};