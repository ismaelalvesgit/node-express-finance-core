import HttpAdapter from "../utils/axios";
import R from "ramda";
import { BcbApi } from "../utils/erro";
import env from "../env";
import { format, subYears } from "date-fns";

/**
 * @typedef Bcb
 * @type {Object}
 * @property {Date} data
 * @property {number} valor
 */

/**
 * @typedef BcbNews
 * @type {Object}
 * @property {string} title
 * @property {string} body
 * @property {string} urlImg
 * @property {string} link
 */

const http = new HttpAdapter({
    baseUrl: env.bcb
});

/**
 * 
 * @param {Object} data 
 * @returns { Array<Bcb> }
 */
const _formatData = (data) => {
    return data.conteudo.map((e) => {
        return {
            data: e.data,
            value: e.valor,
        };
    });
};

/**
 * 
 * @param {Object} data 
 * @returns { Array<BcbNews> }
 */
const _formatDataNews = (data) => {
    return data.conteudo.map((e) => {
        const newUrl = `${env.bcb}${e.link}`;
        return {
            title: e.titulo,
            body: e.corpo,
            urlImg: {
                url: e.urlImg["Url"],
                description: e.urlImg["Description"],
            },
            link: newUrl,
        };
    });
};

/**
 * 
 * @param {Object} data 
 * @returns {Object}
 */
const _formatDataIndicator = (data) => {
    const {
        titulo,
        anoMeta,
        taxaMeta,
        margemErro,
        taxaInflacao,
        Acumulada
    } = data.conteudo[0];

    return {
        title: titulo,
        yearGoal: anoMeta,
        targetRate: taxaMeta,
        marginError: margemErro,
        rateInflation: taxaInflacao,
        accumulated: Acumulada,
    };
};

/**
 * 
 * @param {string} params 
 * @returns {Promise<Bcb>}
 */
export const selic = async (params) => {
    try {
        const { data } = await http.send({
            url: "/api/servico/sitebcb/bcdatasgs",
            method: "GET",
            params: R.reject(R.isNil, {
                serie: 432,
                dataInicial: params.dateStart ? format(params.dateStart, "dd/MM/yyyy") : subYears(new Date(), 1).toLocaleDateString(),
                dataFinal: params.dateEnd ? format(params.dateEnd, "dd/MM/yyyy") : new Date().toLocaleDateString(),
            })
        });

        return _formatData(data);

    } catch (error) {
        const defaultMessage = "Failed to get selic data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @param {string} params 
 * @returns {Promise<Bcb>}
 */
export const inflaction = async (params) => {
    try {
        const { data } = await http.send({
            url: "/api/servico/sitebcb/bcdatasgs",
            method: "GET",
            params: R.reject(R.isNil, {
                serie: 13522,
                dataInicial: params.dateStart ? format(params.dateStart, "dd/MM/yyyy") : subYears(new Date(), 1).toLocaleDateString(),
                dataFinal: params.dateEnd ? format(params.dateEnd, "dd/MM/yyyy") : new Date().toLocaleDateString(),
            })
        });

        return _formatData(data);

    } catch (error) {
        const defaultMessage = "Failed to get inflaction data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @returns {Promise<Bcb>}
 */
export const inflactionIndicator = async () => {
    try {
        const { data } = await http.send({
            url: "/api/servico/sitebcb/indicadorinflacao",
            method: "GET"
        });

        return _formatDataIndicator(data);

    } catch (error) {
        const defaultMessage = "Failed to get inflactionIndicator data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * 
 * @returns {Promise<Bcb>}
 */
export const news = async () => {
    try {
        const { data } = await http.send({
            url: "/api/servico/sitebcb/manchetes",
            method: "GET",
            params: R.reject(R.isNil, {
                listsite: "content/home",
                listname: "Manchetes",
                q: "campanha",
            })
        });

        return _formatDataNews(data);

    } catch (error) {
        const defaultMessage = "Failed to get lastNews data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};