import type { GlobalContext, ResponseObject } from "../types";
export interface TransformResponseObjectOptions {
    path: string;
    ctx: GlobalContext;
}
export default function transformResponseObject(responseObject: ResponseObject, { path, ctx }: TransformResponseObjectOptions): string;
