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
exports.NodeLocationMetadata = void 0;
const marshal = __importStar(require("./marshal"));
const _geoCoordinates_1 = require("./_geoCoordinates");
class NodeLocationMetadata {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._countryCode = json.countryCode == null ? undefined : marshal.string.fromJSON(json.countryCode);
            this._city = json.city == null ? undefined : marshal.string.fromJSON(json.city);
            this._coordinates = json.coordinates == null ? undefined : new _geoCoordinates_1.GeoCoordinates(undefined, json.coordinates);
        }
    }
    /**
     * ISO 3166-1 alpha-2 country code (2 letters)
     */
    get countryCode() {
        return this._countryCode;
    }
    set countryCode(value) {
        this._countryCode = value;
    }
    /**
     * City name
     */
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }
    /**
     * Geographic coordinates
     */
    get coordinates() {
        return this._coordinates;
    }
    set coordinates(value) {
        this._coordinates = value;
    }
    toJSON() {
        return {
            countryCode: this.countryCode,
            city: this.city,
            coordinates: this.coordinates == null ? undefined : this.coordinates.toJSON(),
        };
    }
}
exports.NodeLocationMetadata = NodeLocationMetadata;
//# sourceMappingURL=_nodeLocationMetadata.js.map