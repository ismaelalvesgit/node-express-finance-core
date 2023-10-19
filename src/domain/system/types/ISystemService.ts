export interface ISystemService {
    healthcheck(): Promise<void>
}