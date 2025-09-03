export interface IRedisAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, exp?: number | null): Promise<number | undefined>;
    setNoExp(key: string, value: string): Promise<void>;
    expire(key: string, seconds: number): Promise<number | undefined>;
    delete(key: string): Promise<number | undefined>;
    deleteByPrefix(key: string): Promise<number[] | undefined>;
}
