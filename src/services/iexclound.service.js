import HttpAdapter from "../utils/axios";
import dividendsType from "../enum/dividendsType";
import R from "ramda";
import { IexCloundApi, } from "../utils/erro";
import env from "../env";
import * as yahooService from "./yahoo.service";


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

const http = new HttpAdapter({
    baseUrl: env.iexclound,
    params: {
        token: env.iexcloundKey
    }
});

/**
 * 
 * @param {Object} data 
 * @returns { Quote }
 */
const _formatDataQoute = (data)=>{
    return {
        symbol: data.symbol,
        logourl: `https://storage.googleapis.com/iex/api/logos/${data.symbol}.png`,
        longName: data.companyName,
        regularMarketPrice: data.latestPrice,
        regularMarketDayHigh: data.high,
        regularMarketDayLow: data.low,
        regularMarketChange: data.change,
        regularMarketChangePercent: data.changePercent,
        regularMarketTime: new Date(data.latestUpdate).toISOString(),
        marketCap: data.marketCap,
        regularMarketPreviousClose: data.previousClose,
        regularMarketOpen: data.iexOpen,
        regularMarketVolume: data.avgTotalVolume,
    };
};

/**
 * 
 * @param {Object} data 
 */
const _formatDataDy = (data = [])=>{
    return data.map((e)=>{
        return {
            price: e.amount,
            type: dividendsType.DIVIDEND,
            dateBasis: e.exDate,
            dueDate: e.paymentDate,
            currency: e.currency
        };
    });
};

/**
 * 
 * @param {string} name 
 * @returns {Promise<Quote>}
 */
export const findQoute = async (name)=>{
    try {
        const { usage } = await getCreditUsage();
        if(usage){
            const { data } = await http.send({
                url: `/stock/${name}/quote`,
                method: "GET"
            });

            return _formatDataQoute(data);
        }

        return yahooService.findQoute(name);
    } catch (error) {
        const defaultMessage = "Failed to get quote IexCloundApi";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new IexCloundApi({statusCode: error?.response?.status, message});
    }
};

/**
 * 
 * @param {string} name 
 * @param {string} time 
 * @returns {Promise<[]>}
 */
export const findDividens = async (name, time = "3m")=>{
    try {
        const { data } = await http.send({
            url: `stock/${name}/dividends/${time}`,
            method: "GET"
        });
        return _formatDataDy(data);
    } catch (error) {
        const defaultMessage = "Failed to get dividens";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new IexCloundApi({statusCode: error?.response?.status, message});
    }
};

/**
 * @returns { Promise<any>}
 */
export const getCreditUsage = async ()=>{
    try {
        const { data } = await http.send({
            url: "/account/usage",
            params: {
                token: env.iexcloundKeyAdmin
            },
            method: "GET"
        });

        return {
            usage: data.credits.monthlyUsage >= env.iexcloundLimitUsage ? false : true,
            ... data.credits
        };
    } catch (error) {
        const defaultMessage = "Failed to get credit usage";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        );
        throw new IexCloundApi({statusCode: error?.response?.status, message});
    }
};