import HttpAdapter from "../utils/axios";
import R from "ramda";
import { BcbApi } from "../utils/erro";
import env from "../env";
import { format, subYears } from "date-fns";
import FormData from "form-data";

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

/**
 * @typedef Indice
 * @type {Object}
 * @property {Date} data
 * @property {number} price
 */

const http = new HttpAdapter({
    baseUrl: env.bcb
});

const http2 = new HttpAdapter({
    baseUrl: env.yieldapi
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
 * @returns { Array<Indice> }
 */
const _formatDataIndice = (data) => {
    return data[0].prices.map((e) => {
        return e;
    });
};

/**
 * 
 * @param {Object} data 
 * @returns { Array<Indice> }
 */
const _formatDataIndice2 = (data) => {
    return {
        monthly: data.monthly.map((e) => {
            const year = e.y;
            const month = e.m;
            delete e.y;
            delete e.m;
            return {
                ...e,
                year,
                month
            };
        }),
        yearly: data.yearly.map((e) => {
            const year = e.y;
            const month = e.m;
            delete e.y;
            delete e.m;
            return {
                ...e,
                year,
                month
            };
        }),
    };
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

/**
 * @param {-1 | 0 | 1 | 2 | 3 | 4} type 
 * @returns {Promise<Bcb>}
 */
export const ibovespa = async (type = 0) => {
    try {
        const formData = new FormData();
        formData.append("ticker", "ibovespa");
        formData.append("type", type);
        formData.append("currences[]", "1");
        const { data } = await http2.send({
            url: "/indice/tickerprice",
            method: "POST",
            data: formData,
            headers: formData.getHeaders()
        });

        return _formatDataIndice(data);

    } catch (error) {
        const defaultMessage = "Failed to get ibovespa data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param {-1 | 0 | 1 | 2 | 3 | 4} type
 * @returns {Promise<Bcb>}
 */
export const ifix = async (type = 0) => {
    try {
        const formData = new FormData();
        formData.append("ticker", "ifix");
        formData.append("type", type);
        formData.append("currences[]", "1");

        const { data } = await http2.send({
            url: "/indice/tickerprice",
            method: "POST",
            data: formData,
            headers: formData.getHeaders()
        });

        return _formatDataIndice(data);
        
    } catch (error) {
        const defaultMessage = "Failed to get ifix data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param {-1 | 0 | 1 | 2 | 3 | 4} type
 * @returns {Promise<Bcb>}
 */
export const bdrx = async (type = 0) => {
    try {
        const formData = new FormData();
        formData.append("ticker", "indice-de-bdrs-nao-patrocinados-global");
        formData.append("type", type);
        formData.append("currences[]", "1");

        const { data } = await http2.send({
            url: "/indice/tickerprice",
            method: "POST",
            data: formData,
            headers: formData.getHeaders()
        });

        return _formatDataIndice(data);
        
    } catch (error) {
        const defaultMessage = "Failed to get bdr data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param {string} code
 * @param {1 | 2 | 3 | 4} type
 * @returns {Promise<Bcb>}
 */
 export const bound = async (code, type = 1) => {
    try {
        const formData = new FormData();
        formData.append("ticker", code);
        formData.append("type", type);
 
        const { data } = await http2.send({
            url: "/category/bondprice",
            method: "POST",
            data: formData,
            headers: formData.getHeaders()
        });

        return data;
        
    } catch (error) {
        const defaultMessage = "Failed to get bound data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param { 1 | 2 | 3 | 4} type
 * @returns {Promise<Bcb>}
 */
export const sp500 = async (type = 1) => {
    try {
        const formData = new FormData();
        formData.append("ticker", "sp-500");
        formData.append("type", type);

        const { data } = await http2.send({
            url: "/indiceexterior/tickerprice",
            method: "POST",
            data: formData,
            headers: formData.getHeaders()
        });

        return data;
        
    } catch (error) {
        const defaultMessage = "Failed to get sp500 data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param {0 | 1 | 2 } type
 * @returns {Promise<Bcb>}
 */
export const ipca = async (type = 0) => {
    try {
        const { data } = await http2.send({
            url: "/indexer/getvalue",
            method: "GET",
            params: {
                name: "IPCA",
                type
            }
        });

        return _formatDataIndice2(data);

    } catch (error) {
        const defaultMessage = "Failed to get ipca data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};

/**
 * @param {0 | 1 | 2 } type
 * @returns {Promise<Bcb>}
 */
export const cdi = async (type = 0) => {
    try {
        const { data } = await http2.send({
            url: "/indexer/getvalue",
            method: "GET",
            params: {
                name: "CDI",
                type
            }
        });

        return _formatDataIndice2(data);

    } catch (error) {
        const defaultMessage = "Failed to get cdi data";
        const message = JSON.stringify(R.pathOr(
            defaultMessage,
            ["response", "data", "error"],
            error,
        ));
        throw new BcbApi({ statusCode: error?.response?.status, message });
    }
};