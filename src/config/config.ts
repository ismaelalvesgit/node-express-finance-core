import { injectable } from "tsyringe";
import { Configuration, EnvironmentType } from "./types/config";

@injectable()
export class Config {
    private readonly config: Configuration;

    constructor() {
        this.config = this.getConfigFromEnv();
    }

    public get(): Configuration {
        return this.config;
    }

    private getConfigFromEnv(): Configuration {
        return {
            ...this.getServiceConfig(),
            docs: this.getDocsConfig(),
            db: this.getDbConfig(),
            redis: this.getRedisConfig(),
            email: this.getEmailConfig(),
            apm: this.getApmConfig(),
            kafka: this.getKafkaConfig()
        };
    }

    private getServiceConfig() {
        return {
            serviceName: process.env["SERVICE_NAME"] || "example-horizontal",
            environment: process.env["NODE_ENV"] || EnvironmentType.Develop,
            port: Number(process.env["PORT"]) || 3000,
            timezone: process.env["TZ"] || "America/Fortaleza"
        };
    }

    private getDocsConfig() {
        return {
            enabled: process.env["DOCS_ENABLED"] == "true",
        };
    }

    private getDbConfig() {
        return {
            host: process.env["DB_HOST"] || "",
            port: parseInt(process.env["DB_PORT"] || "3306"),
            user: process.env["DB_USERNAME"] || "",
            password: process.env["DB_PASSWORD"] || "",
            database: process.env["DB_DATABASE"] || "",
            debug: process.env["DB_DEBUG"] === "true",
            pool: {
                min: parseInt(process.env["DB_POOL_MIN"] || "1"),
                max: parseInt(process.env["DB_POOL_MAX"] || "10"),
            }
        };
    }

    private getRedisConfig() {
        return {
            host: process.env["REDIS_HOST"] || "",
            port: parseInt(process.env["REDIS_PORT"] || "6379"),
            timeout: parseInt(process.env["REDIS_TIMEOUT"] || "30000"),
            prefix: process.env["REDIS_PREFIX"] || this.getServiceConfig().serviceName,
        };
    }

    private getApmConfig() {
        return {
            serverUrl: process.env["APM_SERVER_URL"] || "",
            apiKey: process.env["APM_API_KEY"],
            secretToken: process.env["APM_SECRET_TOKEN"],
            cloudProvider: process.env["APM_CLOUND_PROVIDER"] || "none"
        };
    }
  
    private getEmailConfig() {
        return {
            notificator: process.env["EMAIL_USER"] || "",
            apiUrl: process.env["EMAIL_API_URL"] || "https://api.mailjet.com",
            apiKey: process.env["EMAIL_API_KEY"] || "",
            secret: process.env["EMAIL_SECRET"] || ""
        };
    }

    private getKafkaConfig() {
        return {
            brokers: (process.env["KAFKA_BROKER"] || "").split(";"),
            connectionTimeout:  parseInt(process.env["KAFKA_TIMEOUT"] || "30000"),
        };
    }
}