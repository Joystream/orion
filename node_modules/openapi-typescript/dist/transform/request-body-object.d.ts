import type { GlobalContext, RequestBodyObject } from "../types";
export interface TransformRequestBodyObjectOptions {
    path: string;
    ctx: GlobalContext;
}
export default function transformRequestBodyObject(requestBodyObject: RequestBodyObject, { path, ctx }: TransformRequestBodyObjectOptions): string;
