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
exports.MemberMetadata = void 0;
const typeorm_1 = require("typeorm");
const _avatar_1 = require("./_avatar");
const membership_model_1 = require("./membership.model");
let MemberMetadata = class MemberMetadata {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], MemberMetadata.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], MemberMetadata.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : (0, _avatar_1.fromJsonAvatar)(obj) }, nullable: true }),
    __metadata("design:type", Object)
], MemberMetadata.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", Object)
], MemberMetadata.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => membership_model_1.Membership, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", membership_model_1.Membership)
], MemberMetadata.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MemberMetadata.prototype, "memberId", void 0);
MemberMetadata = __decorate([
    (0, typeorm_1.Unique)('MemberMetadata_member', ["member"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], MemberMetadata);
exports.MemberMetadata = MemberMetadata;
//# sourceMappingURL=memberMetadata.model.js.map