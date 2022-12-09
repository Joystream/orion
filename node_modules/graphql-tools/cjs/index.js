"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExecutableSchema = void 0;
var schema_1 = require("@graphql-tools/schema");
Object.defineProperty(exports, "makeExecutableSchema", { enumerable: true, get: function () { return schema_1.makeExecutableSchema; } });
console.warn(`This package has been deprecated and now it only exports makeExecutableSchema.
And it will no longer receive updates.
We recommend you to migrate to scoped packages such as @graphql-tools/schema, @graphql-tools/utils and etc.
Check out https://www.graphql-tools.com to learn what package you should use instead!`);
