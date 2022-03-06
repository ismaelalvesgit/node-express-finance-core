import R from "ramda";
import { Currencyapi } from "../utils/erro";
import HttpAdapter from "../utils/axios";
import env from "../env";
import { xml2json } from "xml-js";

/**
 * @typedef Currency
 * @type {Object}
 * @property {string} id
 * @property {string} code
 * @property {String} codein
 * @property {String} name
 * @property {number} high
 * @property {Number} low
 * @property {Number} varBid
 * @property {Number} pctChange
 * @property {Number} bid
 * @property {Number} ask
 * @property {String} timestamp
 * @property {String} createDate
 */

/**
 * @typedef CurrencyAv
 * @type {Object}
 * @property {string} id
 * @property {string} code
 */

const http = new HttpAdapter({
    baseUrl: env.curreyncyApi
});

/**
 * 
 * @param {Object} data 
 * @returns { Array<Currency> }
 */
 const _formatData = (data)=>{
    return Object.keys(data).map((key)=>{
        return {
            id: key,
            code: data[key].code,
            codein: data[key].codein,
            name: data[key].name,
            high: data[key].high,
            low: data[key].low,
            varBid: data[key].varBid,
            pctChange: data[key].pctChange,
            bid: data[key].bid,
            ask: data[key].ask,
            timestamp: data[key].timestamp,
            createDate: data[key].create_date,
        };
    });
};

/**
 * 
 * @param {Array<string> | string} name
 * @returns {string} 
 */
const __formaUrl = (name)=>{
    if(Array.isArray(name)){
        return name.join(",");
    }

    return name;
};

/**
 * 
 * @param {Object} data
 * @returns {Array<CurrencyAv>} 
 */
const __formatAvailable = (data)=>{
    const tmp = data["elements"][0]["elements"];
    return tmp.map((e)=>{
        return {
            id: e.name,
            code: e.elements[0].text
        };
    });
};

/**
 * 
 * @param {Array<string> | string} name 
 * @returns {Promise<Array<Currency>>}
 */
export const getCurrency = async (name)=>{
    try {
        const { data } = await http.send({
            url: `/last/${__formaUrl(name)}`,
            method: "GET"
        });

        return _formatData(data);
    } catch (error) {
        const defaultMessage = "Failed to get currency";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "message"],
            error,
        );
        throw new Currencyapi({statusCode: error?.response?.status, message});
    }
};

/**
 * @returns {Promise<Array<CurrencyAv>>}
 */
export const getAvailable = async ()=>{
    try {
        const { data } = await http.send({
            url: "/xml/available",
            method: "GET"
        });

        return __formatAvailable(JSON.parse(xml2json(data)));
    } catch (error) {
        const defaultMessage = "Failed to get available currency";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "message"],
            error,
        );
        throw new Currencyapi({statusCode: error?.response?.status, message});
    }
};

/**
 * @returns {Promise<Array<CurrencyAv>>}
 */
export const getId = async ()=>{
    try {
        const { data } = await http.send({
            url: "/xml/available/uniq",
            method: "GET"
        });

        return __formatAvailable(JSON.parse(xml2json(data)));
    } catch (error) {
        const defaultMessage = "Failed to get code currency";
        const message = R.pathOr(
            defaultMessage,
            ["response", "data", "message"],
            error,
        );
        throw new Currencyapi({statusCode: error?.response?.status, message});
    }
};
