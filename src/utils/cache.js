import env from "../env";
import redisClient from "../redis";

/**
 * 
 * @param {import('ioredis').KeyType} key 
 * @param {import('ioredis').ValueType} value 
 * @param {number} timeExp 
 * @returns {Promise<"OK">}
 */
export const setCache = (key, value, timeExp) => {
    if (env.redis.host) {
        return redisClient.set(key, value, "EX", timeExp);
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
        return data ? JSON.parse(data) : null;
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('ioredis').KeyType} key 
 * @returns {Promise<number>}
 */
export const delCache = (req, key) => {
    if (env.redis.host) {
        if (req) {
            return redisClient.del(req.originalUrl || req.url);
        }
        return redisClient.del(key);
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