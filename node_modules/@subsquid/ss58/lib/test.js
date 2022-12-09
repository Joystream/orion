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
const assert_1 = __importDefault(require("assert"));
const ss58 = __importStar(require("./index"));
// registry.get()
assert_1.default.strictEqual(ss58.registry.get('kusama'), ss58.registry.get(2));
assert_1.default.deepEqual(ss58.registry.get('kusama'), {
    "prefix": 2,
    "network": "kusama",
    "displayName": "Kusama Relay Chain",
    "symbols": ["KSM"],
    "decimals": [12],
    "standardAccount": "*25519",
    "website": "https://kusama.network"
});
assert_1.default.throws(() => ss58.registry.get('fakefoo'));
assert_1.default.throws(() => ss58.registry.get(500000));
// registry.find()
assert_1.default.strictEqual(ss58.registry.find('kusama'), ss58.registry.get('kusama'));
assert_1.default.strictEqual(ss58.registry.find('fakefoo'), undefined);
// codec (ALICE)
assert_1.default.deepEqual(ss58.codec(42).decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'), Buffer.from('d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', 'hex'));
assert_1.default.strictEqual(ss58.codec(42).encode(Buffer.from('d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d', 'hex')), '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
assert_1.default.throws(() => ss58.codec(2).decode('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'));
console.log('ok');
//# sourceMappingURL=test.js.map