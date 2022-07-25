import { getCache, setCache } from "../utils/cache";

/**
 * @param {Object} options
 * @param {number} options.timeExp
 * @param {string} options.path
 * @returns {import('express').RequestHandler}
 */
export default function cachedMiddleware(options) {
    return async (req, res, next) => {
        const { timeExp, path } = options
        const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress).replace(":", "").replace(".", "-");
        const urlCache = (req.originalUrl || req.url).replace("/", ":").substring(1)
        const prefix = path ? path.concat(':', urlCache) : urlCache
        const key = prefix.concat(ip);
        const data = await getCache(key);
        if (data) {
            res.json(data);
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                setCache(key, body, timeExp || 300);
                res.sendResponse(body);
            };
            return next();
        }
    };
}