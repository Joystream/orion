import { PonyfillRequest, RequestPonyfillInit } from './Request';
import { PonyfillResponse } from './Response';
export declare function fetchPonyfill<TResponseJSON = any, TRequestJSON = any>(info: string | PonyfillRequest<TRequestJSON> | URL, init?: RequestPonyfillInit): Promise<PonyfillResponse<TResponseJSON>>;
