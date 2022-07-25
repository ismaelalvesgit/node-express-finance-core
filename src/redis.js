import Redis from "ioredis";
import env from "./env";
import { Logger } from "./logger";

/** @type {import('ioredis').Redis} */
let redisClient;
if(env.redis.host){
    redisClient = new Redis({
        host: env.redis.host,
        port: env.redis.port,
    });
    Logger.info("Registered service REDIS is ON");
}else{
    Logger.info("Not registered service REDIS");
}

export default redisClient;