import type { GlobalContext, MediaTypeObject } from "../types";
export interface TransformMediaTypeObjectOptions {
    path: string;
    ctx: GlobalContext;
}
export default function transformMediaTypeObject(mediaTypeObject: MediaTypeObject, { path, ctx }: TransformMediaTypeObjectOptions): string;
