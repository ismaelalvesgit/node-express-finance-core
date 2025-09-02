export interface Configuration {
    port: number
    serviceHost: string
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
    apm: {
        serverUrl: string
        apiKey?: string
        secretToken?: string
        cloudProvider?: string
    }
    backend: {
        invest: string
        bcb: string
        news: string
    }
    system: {
        fees: {
            outsidePercent: number
        }
    }
    timezone: string
}

export enum EnvironmentType {
    Develop = "development",
    Production = "production",
    Test = "test"
}
