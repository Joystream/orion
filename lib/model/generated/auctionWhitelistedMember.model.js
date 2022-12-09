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
exports.AuctionWhitelistedMember = void 0;
const typeorm_1 = require("typeorm");
const auction_model_1 = require("./auction.model");
const membership_model_1 = require("./membership.model");
let AuctionWhitelistedMember = class AuctionWhitelistedMember {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AuctionWhitelistedMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auction_model_1.Auction, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", auction_model_1.Auction)
], AuctionWhitelistedMember.prototype, "auction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], AuctionWhitelistedMember.prototype, "auctionId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", membership_model_1.Membership)
], AuctionWhitelistedMember.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], AuctionWhitelistedMember.prototype, "memberId", void 0);
AuctionWhitelistedMember = __decorate([
    (0, typeorm_1.Unique)('AuctionWhitelistedMember_auction_member', ["auction", "member"], { deferrable: 'INITIALLY DEFERRED' }),
    (0, typeorm_1.Index)(["auction", "member"]),
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], AuctionWhitelistedMember);
exports.AuctionWhitelistedMember = AuctionWhitelistedMember;
//# sourceMappingURL=auctionWhitelistedMember.model.js.map