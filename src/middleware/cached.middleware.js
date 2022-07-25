import { getCache, setCache } from "../utils/cache";

/**
 * @param {number} timeExp
 * @returns {import('express').RequestHandler}
 */
export default function cachedMiddleware(timeExp = 20) {
    return async (req, res, next) => {
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace(':', '').replace('.', '-')
        const key = (req.originalUrl || req.url).replace('/', ':').substring(1).concat(ip);
        const data = await getCache(key);
        if (data) {
            res.json(data);
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                setCache(key, body, timeExp);
                res.sendResponse(body);
            };
            return next();
        }
    };
}