import HttpAdapter from "../utils/axios";
import R from "ramda";
import { NewsApi } from "../utils/erro";
import env from "../env";


/**
 * @typedef News
 * @type {Object}
 * @property {string} author
 * @property {string} title
 * @property {string} description
 * @property {string} url
 * @property {string} source
 * @property {string} image
 * @property {string} category
 * @property {string} language
 * @property {string} country
 * @property {Date} published_at
 */

/**
 * @typedef NewsDataApi
 * @type {Object}
 * @property {Object} pagination
 * @property {number} pagination.limit
 * @property {number} pagination.offset
 * @property {number} pagination.count
 * @property {number} pagination.total
 * @property {Array<News>} data
 */

const http = new HttpAdapter({
    baseUrl: env.news,
    params: {
        "access_key": env.newsKey,
        sort: "published_desc",
        categories: "business",
    }
});

/**
 * 
 * @param {string} name 
 * @returns {Promise<NewsDataApi>}
 */
export const findNews = async (params)=>{
    try {
        
        const { data } = await http.send({
            url: "/v1/news",
            method: "GET",
            params
        });

        return data;
        
    } catch (error) {
        const defaultMessage = "Failed to get news NewsApi";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new NewsApi({statusCode: error?.response?.status, message});
    }
};