export type PonyfillHeadersInit = [string, string][] | Record<string, string | string[] | undefined> | Headers;
export declare class PonyfillHeaders implements Headers {
    private map;
    constructor(headersInit?: PonyfillHeadersInit);
    append(name: string, value: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    delete(name: string): void;
    forEach(callback: (value: string, key: string, parent: Headers) => void): void;
    entries(): IterableIterator<[string, string]>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
}
