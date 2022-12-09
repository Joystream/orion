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
exports.StorageBucketOperatorStatusActive = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class StorageBucketOperatorStatusActive {
    constructor(props, json) {
        this.isTypeOf = 'StorageBucketOperatorStatusActive';
        Object.assign(this, props);
        if (json != null) {
            this._workerId = marshal.int.fromJSON(json.workerId);
            this._transactorAccountId = marshal.string.fromJSON(json.transactorAccountId);
        }
    }
    get workerId() {
        (0, assert_1.default)(this._workerId != null, 'uninitialized access');
        return this._workerId;
    }
    set workerId(value) {
        this._workerId = value;
    }
    get transactorAccountId() {
        (0, assert_1.default)(this._transactorAccountId != null, 'uninitialized access');
        return this._transactorAccountId;
    }
    set transactorAccountId(value) {
        this._transactorAccountId = value;
    }
    toJSON() {
        return {
            isTypeOf: this.isTypeOf,
            workerId: this.workerId,
            transactorAccountId: this.transactorAccountId,
        };
    }
}
exports.StorageBucketOperatorStatusActive = StorageBucketOperatorStatusActive;
//# sourceMappingURL=_storageBucketOperatorStatusActive.js.map