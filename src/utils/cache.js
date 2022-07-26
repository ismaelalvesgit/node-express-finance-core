import env from "../env";
import redisClient from "../redis";

export const TIME_DAY = 86400;

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @param {import('ioredis').ValueType} value 
 * @param {number} timeExp 
 * @returns {Promise<"OK">}
 */
export const setCache = (key, value, timeExp = TIME_DAY) => {
    if (env.redis.host) {
        return redisClient.set(env.redis.prefix.concat(key), value, "EX", timeExp);
    }
};

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @returns {object}
 */
export const getCache = async (key) => {
    if (env.redis.host) {
        const data = await redisClient.get(env.redis.prefix.concat(key));
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {Array<import('ioredis').KeyType>} key 
 * @returns {Promise<Array<number>>}
 */
export const delCache = (req, key) => {
    if (env.redis.host) {
        const prossed = [];
        if (req) {
            const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress).replace(":", "").replace(".", "-");
            const key = (req.originalUrl || req.url).replace("/", ":").substring(1).concat(ip);
            prossed.push(redisClient.del(env.redis.prefix.concat(key)));
        }

        if(key){
            key.forEach((prefix)=>{
                prossed.push(redisClient.del(prefix));
            });
        }

        return Promise.all(prossed);
    }
};

/**
 * 
 * @param {string} prefix 
 * @returns {void}
 */
export const delPrefixCache = async (prefix) => {
    if (env.redis.host) {
        const keys = await redisClient.keys(`${env.redis.prefix}${prefix}:*`);
        return keys.length > 0 ? redisClient.del(keys) : null;
    }
};

/**
 * 
 * @param {string[]} keys
 * @returns {void}
 */
export const delKeysCache = async (keys) => {
    if (env.redis.host) {
        return Promise.all(keys.map((key)=> delPrefixCache(key)));
    }
};