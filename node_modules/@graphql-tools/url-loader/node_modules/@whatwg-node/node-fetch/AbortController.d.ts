import { PonyfillAbortSignal } from './AbortSignal';
export declare class PonyfillAbortController implements AbortController {
    signal: PonyfillAbortSignal;
    abort(reason?: any): void;
}
