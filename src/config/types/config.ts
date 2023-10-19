export interface Configuration {
    port: number
    serviceName: string
    environment: string
    docs: {
        enabled: boolean
    }
    db: {
        host: string
        port: number
        user: string
        password: string
        database: string
        debug: boolean
        pool: {
            min: number
            max: number
        }
    }
    redis: {
        host: string
        port: number
        timeout: number
        prefix: string
    }
    email: {
        notificator: string
        apiUrl: string
        apiKey: string
        secret: string
    }
    apm: {
        serverUrl: string
        apiKey?: string
        secretToken?: string
        cloudProvider?: string
    }
    kafka: {
        brokers: string[]
        connectionTimeout: number
    }
    backend: {
        brapi: string
    }
    system: {
        fees: {
            outsidePercent: number
        }
    }
    timezone: string
}

export enum EnvironmentType {
    Develop = "develop",
    Production = "production",
    Test = "test"
}