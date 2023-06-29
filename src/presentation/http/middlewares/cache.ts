import { container } from "@di/container";
import { ICacheHandlerParams } from "@helpers/ICommon";
import RedisClient from "@infrastructure/cache/redis";
import { RequestHandler } from "express";
import hash from "object-hash";

const cacheHandler = ({path, timeExp}: ICacheHandlerParams): RequestHandler =>{
    const redis = container.resolve(RedisClient);

    return async (req, res: any, next)=>{
        if (req.headers["cache-control"] !== "no-cache") {
            const urlCache = hash((req.originalUrl || req.url).replace("/", ":").substring(1));
            const key = path ? path.concat(":", urlCache) : urlCache;
            const data = await redis.get(key);
            if (data) {
                res.json(data);
            } else {
                res.sendResponse = res.send;
                res.send = (body: string)=>{
                    if(res.statusCode < 400){
                        redis.set(key, body, timeExp || 600);
                    }
                    res.sendResponse(body);
                };
                return next();
            }
        } else {
            return next();
        } 
    };
};

export default cacheHandler;