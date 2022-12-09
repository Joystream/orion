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
exports.Membership = void 0;
const typeorm_1 = require("typeorm");
const auctionWhitelistedMember_model_1 = require("./auctionWhitelistedMember.model");
const channel_model_1 = require("./channel.model");
const bannedMember_model_1 = require("./bannedMember.model");
/**
 * Stored information about a registered user
 */
let Membership = class Membership {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Membership.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date
    /**
     * The unique handle chosen by member
     */
    )
], Membership.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Membership.prototype, "handle", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], Membership.prototype, "controllerAccount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auctionWhitelistedMember_model_1.AuctionWhitelistedMember, e => e.member),
    __metadata("design:type", Array)
], Membership.prototype, "whitelistedInAuctions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_model_1.Channel, e => e.ownerMember),
    __metadata("design:type", Array)
], Membership.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bannedMember_model_1.BannedMember, e => e.member),
    __metadata("design:type", Array)
], Membership.prototype, "bannedFromChannels", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Membership.prototype, "totalChannelsCreated", void 0);
Membership = __decorate([
    (0, typeorm_1.Unique)('Membership_handle', ["handle"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Membership);
exports.Membership = Membership;
//# sourceMappingURL=membership.model.js.map