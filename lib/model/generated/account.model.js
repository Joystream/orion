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
exports.Account = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const membership_model_1 = require("./membership.model");
/**
 * A Gateway Account
 */
let Account = class Account {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => user_model_1.User, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_model_1.User)
], Account.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Account.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Account.prototype, "isEmailConfirmed", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Account.prototype, "isBlocked", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * On-chain membership associated with the gateway account
     */
    )
], Account.prototype, "registeredAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.OneToOne)(() => membership_model_1.Membership, { nullable: false, deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", membership_model_1.Membership)
], Account.prototype, "membership", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "membershipId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Account.prototype, "joystreamAccount", void 0);
Account = __decorate([
    (0, typeorm_1.Unique)('Account_user', ["user"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Unique)('Account_email', ["email"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Unique)('Account_membership', ["membership"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Unique)('Account_joystreamAccount', ["joystreamAccount"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Account);
exports.Account = Account;
//# sourceMappingURL=account.model.js.map