export interface IRedisAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, exp?: number): Promise<number | undefined>;
    expire(key: string, seconds: number): Promise<number | undefined>;
    delete(key: string): Promise<number | undefined>;
    deleteByPrefix(key: string): Promise<number[] | undefined>;
}