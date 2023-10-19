export interface ISystemRepository {
    healthcheck(): Promise<void>
}