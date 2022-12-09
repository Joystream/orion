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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentActorCurator = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class ContentActorCurator {
    constructor(props, json) {
        this.isTypeOf = 'ContentActorCurator';
        Object.assign(this, props);
        if (json != null) {
            this._curator = marshal.string.fromJSON(json.curator);
        }
    }
    get curator() {
        (0, assert_1.default)(this._curator != null, 'uninitialized access');
        return this._curator;
    }
    set curator(value) {
        this._curator = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            curator: this.curator,
        };
    }
}
exports.ContentActorCurator = ContentActorCurator;
//# sourceMappingURL=_contentActorCurator.js.map