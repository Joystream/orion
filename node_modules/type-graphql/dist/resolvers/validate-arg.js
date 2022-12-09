"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArg = void 0;
const ArgumentValidationError_1 = require("../errors/ArgumentValidationError");
async function validateArg(argValue, argType, globalValidate, argValidate) {
    const validate = argValidate !== undefined ? argValidate : globalValidate;
    if (validate === false || argValue == null || typeof argValue !== "object") {
        return argValue;
    }
    if (typeof validate === "function") {
        await validate(argValue, argType);
        return argValue;
    }
    const validatorOptions = Object.assign({}, typeof globalValidate === "object" ? globalValidate : {}, typeof argValidate === "object" ? argValidate : {});
    if (validatorOptions.skipMissingProperties !== false) {
        validatorOptions.skipMissingProperties = true;
    }
    const { validateOrReject } = await Promise.resolve().then(() => __importStar(require("class-validator")));
    try {
        if (Array.isArray(argValue)) {
            await Promise.all(argValue.map(argItem => validateOrReject(argItem, validatorOptions)));
        }
        else {
            await validateOrReject(argValue, validatorOptions);
        }
        return argValue;
    }
    catch (err) {
        throw new ArgumentValidationError_1.ArgumentValidationError(err);
    }
}
exports.validateArg = validateArg;
