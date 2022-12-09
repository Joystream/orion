import type { GlobalContext, PathItemObject } from "../types";
export interface TransformPathItemObjectOptions {
    path: string;
    ctx: GlobalContext;
}
export default function transformPathItemObject(pathItem: PathItemObject, { path, ctx }: TransformPathItemObjectOptions): string;
