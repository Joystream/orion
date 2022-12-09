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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auction = void 0;
const typeorm_1 = require("typeorm");
const marshal = __importStar(require("./marshal"));
const ownedNft_model_1 = require("./ownedNft.model");
const membership_model_1 = require("./membership.model");
const _auctionType_1 = require("./_auctionType");
const bid_model_1 = require("./bid.model");
const auctionWhitelistedMember_model_1 = require("./auctionWhitelistedMember.model");
/**
 * Represents NFT auction
 */
let Auction = class Auction {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Auction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => ownedNft_model_1.OwnedNft, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", ownedNft_model_1.OwnedNft)
], Auction.prototype, "nft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "nftId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => membership_model_1.Membership, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Auction.prototype, "winningMember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "winningMemberId", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: false }),
    __metadata("design:type", BigInt)
], Auction.prototype, "startingPrice", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { transformer: marshal.bigintTransformer, nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "buyNowPrice", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : (0, _auctionType_1.fromJsonAuctionType)(obj) }, nullable: false }),
    __metadata("design:type", Object)
], Auction.prototype, "auctionType", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => bid_model_1.Bid, { nullable: true, deferrable: 'INITIALLY DEFERRED' }),
    __metadata("design:type", Object)
], Auction.prototype, "topBid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "topBidId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_model_1.Bid, e => e.auction),
    __metadata("design:type", Array)
], Auction.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], Auction.prototype, "startsAtBlock", void 0);
__decorate([
    (0, typeorm_1.Column)("int4", { nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "endedAtBlock", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Auction.prototype, "isCanceled", void 0);
__decorate([
    (0, typeorm_1.Column)("bool", { nullable: false }),
    __metadata("design:type", Boolean)
], Auction.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auctionWhitelistedMember_model_1.AuctionWhitelistedMember, e => e.auction),
    __metadata("design:type", Array)
], Auction.prototype, "whitelistedMembers", void 0);
Auction = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Auction);
exports.Auction = Auction;
//# sourceMappingURL=auction.model.js.map