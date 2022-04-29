import {
    BadRequest,
    Brapi,
    Currencyapi,
    InternalServer,
    NewsApi,
    NotFound,
    ValidadeSchema
} from "../utils/erro";
import { StatusCodes } from "http-status-codes";
import { Logger } from "../logger";
import elasticAgent from "../apm";
import env from "../env";

/**
 * @typedef ErrorConfig
 * @type {Object}
 * @property {typeof CodedError} class
 * @property {string} code
 * @property {String} i18n
 */

/**
 * @type {ErrorConfig[]}
 */
const errorsConfigs = [
    { class: NotFound, code: null, i18n: "NotFound" },

    { class: InternalServer, code: "Category", i18n: "InternalServer.Category" },
    { class: InternalServer, code: "Broker", i18n: "InternalServer.Broker" },
    { class: BadRequest, code: "Transaction.qnt", i18n: "Transaction.Qnt" },

    { class: Error, code: "ER_DUP_ENTRY", i18n: "BadRequest.Duplicate" },
    { class: ValidadeSchema, code: "any.required", i18n: "ValidadeSchema.required" },
    { class: ValidadeSchema, code: "any.only", i18n: "ValidadeSchema.only" },
    { class: ValidadeSchema, code: "string.min", i18n: "ValidadeSchema.min" },
    { class: ValidadeSchema, code: "string.email", i18n: "ValidadeSchema.email" },
    { class: ValidadeSchema, code: "async.exist", i18n: "ValidadeSchema.async" },
];

/**
 * @param {Error} error
 */
const _getErrorConfig = error => errorsConfigs.find((errorConfig) => {
    if (error instanceof NotFound && error instanceof errorConfig.class) {
        return errorConfig;
    } else {
        if (error instanceof errorConfig.class && (error._code === errorConfig.code || error.code === errorConfig.code)) {
            return errorConfig;
        }
    }
});

/**
 * @param {import('express').Request} req
 * @param {Error} error
 */
/* eslint-disable no-unused-vars*/
const _loadErrorMessage = (req, error) => {
    if (error instanceof ValidadeSchema) {
        error.message = JSON.stringify(
            JSON.parse(error.message).map(element => {
                let e = error;
                e._code = element.type;
                const errorConfig = _getErrorConfig(e);
                if (errorConfig) {
                    element.message = req.__(errorConfig.i18n, {
                        name: element.context.key,
                        limit: element.context.limit,
                        value: element.context.value,
                        valids: element.context.valids,
                        code: error._code
                    });
                    return element;
                }
                return element;
            })
        );
    } else {
        const errorConfig = _getErrorConfig(error);
        if (errorConfig) {
            const errorWithMessage = error;
            let data = {};
            switch (error.code) {
                case "ER_DUP_ENTRY":
                    data.dup = error.sqlMessage.split(/'(.*?)'/)[1];
                    break;
                default:
                    break;
            }
            errorWithMessage.message = req.__(errorConfig.i18n, {
                params: req.params,
                query: req.query,
                headers: req.headers,
                body: req.body,
                code: error._code,
                duplicateValue: data.dup
            });
        }
    }
};

/* eslint-disable no-unused-vars*/
export default function errorHandler(error, req, res, next) {
    Logger.warn(`${req.requestId} ${error.message}`);
    _loadErrorMessage(req, error);
    switch (error.constructor) {
        case ValidadeSchema: {
            let response = JSON.parse(error.message).map((i) => {
                return {
                    name: i.context.key,
                    message: i.message
                };
            });
            res.status(error.statusCode).json(response);
            break;
        }
        case NotFound: {
            res.status(StatusCodes.NOT_FOUND).json([{ message: error.message }]);
            break;
        }
        case Brapi: {
            res.status(error.statusCode || 400).json([{ message: error.message }]);
            break;
        }
        case Currencyapi: {
            res.status(error.statusCode || 400).json([{ message: error.message }]);
            break;
        }
        case NewsApi: {
            res.status(error.statusCode || 400).json([JSON.parse(error.message)]);
            break;
        }
        case BadRequest: {
            res.status(StatusCodes.BAD_REQUEST).json([{ message: error.message }]);
            break;
        }
        default: {
            if (error.code) {
                /**
                 * Aqui são tratados erros de banco de dados caso queria deixar mais dinamico a sua resposta
                 * verifique o link abaixo para consultar a lista de erros do mariadb/mysql 😇.
                 * https://mariadb.com/kb/en/mariadb-error-codes/
                 */
                let message = error.message || error.sqlMessage;
                if(env.env !== "development"){
                    message = `Contact the developer and give me your ID ${req.requestId}, we're sorry this happened 😞`;
                }
                res.status(StatusCodes.NOT_ACCEPTABLE).json([{ message }]);
            } else {
                if (elasticAgent && elasticAgent.isStarted()) {
                    elasticAgent.captureError(error, () => {
                        Logger.error(`ID - ${req.requestId}, Send APM: ${error.message}`);
                    });
                } else {
                    Logger.error(`ID - ${req.requestId}, Error: ${error.message}`);
                }
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([{
                    message: `Contact the developer and give me your ID ${req.requestId}, we're sorry this happened 😞`
                }]);
            }
        }
    }
}