"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.GeographicalAreaSubdivistion = void 0;
const marshal = __importStar(require("./marshal"));
class GeographicalAreaSubdivistion {
    constructor(props, json) {
        this.isTypeOf = 'GeographicalAreaSubdivistion';
        Object.assign(this, props);
        if (json != null) {
            this._subdivisionCode = json.subdivisionCode == null ? undefined : marshal.string.fromJSON(json.subdivisionCode);
        }
    }
    /**
     * ISO 3166-2 subdivision code
     */
    get subdivisionCode() {
        return this._subdivisionCode;
    }
    set subdivisionCode(value) {
        this._subdivisionCode = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            subdivisionCode: this.subdivisionCode,
        };
    }
}
exports.GeographicalAreaSubdivistion = GeographicalAreaSubdivistion;
//# sourceMappingURL=_geographicalAreaSubdivistion.js.map