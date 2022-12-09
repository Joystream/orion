export declare class Codec {
    readonly prefix: number;
    constructor(prefix: number);
    encode(bytes: Uint8Array): string;
    decode(s: string): Uint8Array;
}
//# sourceMappingURL=codec.d.ts.map