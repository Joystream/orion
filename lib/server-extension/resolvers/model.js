"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const tools_1 = require("@subsquid/openreader/lib/tools");
const path_1 = require("path");
const rootDir = (0, path_1.resolve)(__dirname, '../../..');
const schemaFile = (0, tools_1.resolveGraphqlSchema)(rootDir);
exports.model = (0, tools_1.loadModel)(schemaFile);
//# sourceMappingURL=model.js.map