"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionArtifacts = void 0;
const typeorm_1 = require("typeorm");
const account_model_1 = require("./account.model");
let EncryptionArtifacts = class EncryptionArtifacts {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], EncryptionArtifacts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => account_model_1.Account, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", account_model_1.Account)
], EncryptionArtifacts.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EncryptionArtifacts.prototype, "accountId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], EncryptionArtifacts.prototype, "cipherIv", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], EncryptionArtifacts.prototype, "encryptedSeed", void 0);
EncryptionArtifacts = __decorate([
    (0, typeorm_1.Unique)('EncryptionArtifacts_account', ["account"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], EncryptionArtifacts);
exports.EncryptionArtifacts = EncryptionArtifacts;
//# sourceMappingURL=encryptionArtifacts.model.js.map