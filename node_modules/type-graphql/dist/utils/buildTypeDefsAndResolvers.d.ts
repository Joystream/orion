import { BuildSchemaOptions } from "./buildSchema";
export declare function buildTypeDefsAndResolvers(options: BuildSchemaOptions): Promise<{
    typeDefs: string;
    resolvers: import("..").ResolversMap<any, any>;
}>;
export declare function buildTypeDefsAndResolversSync(options: BuildSchemaOptions): {
    typeDefs: string;
    resolvers: import("..").ResolversMap<any, any>;
};
