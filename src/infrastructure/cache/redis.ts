import { inject, injectable } from "tsyringe";
import Redis from "ioredis";
import { IRedisAdapter } from "@infrastructure/types/IRedisAdapter";
import { tokens } from "@di/tokens";
import { Config } from "@config/config";
import { Logger } from "@infrastructure/logger/logger";

@injectable()
export default class RedisClient implements IRedisAdapter {
    protected readonly client?: Redis;
    protected readonly timeDay = 86400;

    constructor(
        @inject(tokens.Config)
        private config: Config,
    ) {
        const { redis: { host, port, timeout } } = config.get();
        this.client = host.length > 0 ? new Redis({
            host,
            port,
            commandTimeout: timeout,
            connectTimeout: timeout,
            disconnectTimeout: timeout,
        }) : undefined;

        this.client?.on("error", (err) => this.onError(err));
    }

    private onError(error: Error) {
        const code = error["code"];
        if (code === "ECONNREFUSED") {
            Logger.error(error);
            this.client?.disconnect();
        }
    }

    private get closed (){
        return (this.client?.status === "close" || this.client?.status === "end");
    }

    async get(key: string): Promise<string | null> {
        try {
            if(this.closed) {
                return null;
            }

            const path = `${this.config.get().redis.prefix}:${key}`;
            const data = await this.client?.get.bind(this.client)(path);
            return JSON.parse(data || "");
           
        } catch (error) {
            Logger.error(`Redis: ${error}`);
            return null;
        }
    }

    async set(key: string, value: string, exp?: number): Promise<number | undefined> {
        try {
            if(this.closed) {
                return undefined;
            }
            const path = `${this.config.get().redis.prefix}:${key}`;
            this.client?.set.bind(this.client)(path, value);
            return this.expire(key, exp ?? this.timeDay);
        } catch (error) {
            Logger.error(`Redis: ${error}`);
            return undefined;
        }
    }

    async expire(key: string, seconds: number): Promise<number | undefined> {
        try {
            if(this.closed) {
                return undefined;
            }
            const path = `${this.config.get().redis.prefix}:${key}`;
            return this.client?.expire.bind(this.client)(path, seconds);
        } catch (error) {
            Logger.error(`Redis: ${error}`);
            return undefined;
        }
    }

    async delete(key: string) {
        try {
            if(this.closed) {
                return undefined;
            }
            const path = `${this.config.get().redis.prefix}:${key}`;
            return this.client?.del.bind(this.client)(path);
        } catch (error) {
            Logger.error(`Redis: ${error}`);
            return undefined;
        }
    }

    async deleteByPrefix(prefix: string) {
        try {
            if(this.closed) {
                return undefined;
            }
            const path = `${this.config.get().redis.prefix}:${prefix}`;
            const keys = await this.client?.keys.bind(this.client)(`${path}:*`);
            if (Array.isArray(keys)) {
                const data = await Promise.all(keys.map((key) => {
                    return this.delete(key.split(`${this.config.get().redis.prefix}:`)[1]);
                }));
                return data.filter(del => del !== undefined) as number[];
            }
            return undefined;
        } catch (error) {
            Logger.error(`Redis: ${error}`);
            return undefined;
        }
    }

}
