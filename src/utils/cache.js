import env from "../env";
import redisClient from "../redis";

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @param {import('ioredis').ValueType} value 
 * @param {number} timeExp 
 * @returns {Promise<"OK">}
 */
export const setCache = (key, value, timeExp = 86400) => {
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
        const data = await redisClient.get(key);
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
            prossed.push(redisClient.del(req.originalUrl || req.url));
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
        const keys = (await redisClient.keys(`${env.redis.prefix}${prefix}:*`)).map((key) => {
            key.replace(env.redis.prefix, "");
        });
        return keys.length > 0 ? redisClient.del(keys) : null;
    }
};